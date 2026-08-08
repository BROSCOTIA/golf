#!/usr/bin/env bash
# =============================================================================
# run.sh - Master Supervisor & Unified Runner for Golf Town / ENI Portal
# =============================================================================
# Supports Debian/Ubuntu Linux & Android Termux Environments
# Secure tunnel orchestration | Service lifecycle management | Health monitoring
# =============================================================================

set -o nounset
set -o pipefail
shopt -s inherit_errexit 2>/dev/null || true

# =============================================================================
# CONSTANTS & CONFIGURATION
# =============================================================================

readonly SCRIPT_NAME=$(basename "$0")
readonly SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd) # Project Root

# Load local .env variables if present
if [[ -f "${SCRIPT_DIR}/.env" ]]; then
    set -a
    source "${SCRIPT_DIR}/.env"
    set +a
fi

: "${SILENT:=false}"
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}

readonly STATE_DIR="${SCRIPT_DIR}/.state"
readonly STATE_FILE="${STATE_DIR}/supervisor.json"
readonly PID_DIR="${STATE_DIR}/pids"
readonly LOG_DIR="${SCRIPT_DIR}"
readonly TOKEN="${TELEGRAM_BOT_TOKEN:-${TELEGRAM_TOKEN:-}}"
readonly CHAT_ID="${TELEGRAM_CHAT_ID:-}"

readonly MAX_TUNNEL_WAIT=45
readonly TUNNEL_RETRY_MAX=5
readonly WATCHDOG_INTERVAL=60

export PATH="${PATH}:${SCRIPT_DIR}/node_modules/.bin"

# =============================================================================
# PORTABLE COLOR DETECTION
# =============================================================================

if [[ -t 1 ]] && [[ -t 2 ]] && [[ ${TERM:-} != "" ]] && command -v tput &>/dev/null; then
    readonly CRESET=$(tput sgr0)
    readonly CBOLD=$(tput bold)
    readonly CDIM=$(tput dim)
    readonly CRED=$(tput setaf 1)
    readonly CGRN=$(tput setaf 2)
    readonly CYLW=$(tput setaf 3)
    readonly CBLU=$(tput setaf 4)
    readonly CWHT=$(tput setaf 7)
    readonly CBRED=$(tput setaf 9)
    readonly CBGRN=$(tput setaf 10)
    readonly CBYLW=$(tput setaf 11)
    readonly CBBLU=$(tput setaf 12)
    readonly CBWHT=$(tput setaf 15)
    readonly CDKGREY=$(tput setaf 240)
    readonly CLTGREY=$(tput setaf 247)
else
    readonly CRESET="" CBOLD="" CDIM="" CRED="" CGRN="" CYLW="" CBLU="" CWHT=""
    readonly CBRED="" CBGRN="" CBYLW="" CBBLU="" CBWHT="" CDKGREY="" CLTGREY=""
fi

readonly SYM_SYS="${CLTGREY}◆${CRESET}"
readonly SYM_OK="${CBGRN}✓${CRESET}"
readonly SYM_FAIL="${CBRED}✗${CRESET}"
readonly SYM_WARN="${CBYLW}⚠${CRESET}"
readonly SYM_INFO="${CBBLU}ℹ${CRESET}"
readonly LINE="${CDKGREY}$(printf '%.0s─' {1..60})${CRESET}"

# =============================================================================
# OUTPUT HELPERS
# =============================================================================

info()  { [[ "${SILENT}" == "true" ]] && return; echo -e " ${SYM_INFO}  $*" >&2; }
ok()    { [[ "${SILENT}" == "true" ]] && return; echo -e " ${SYM_OK}  $*" >&2; }
warn()  { [[ "${SILENT}" == "true" ]] && return; echo -e " ${SYM_WARN}  $*" >&2; }
fail()  { echo -e " ${SYM_FAIL}  $*" >&2; }
sys()   { [[ "${SILENT}" == "true" ]] && return; echo -e " ${SYM_SYS}  $*" >&2; }

escape_html() {
    local str="$1"
    str="${str//&/&amp;}"
    str="${str//</&lt;}"
    str="${str//>/&gt;}"
    echo -n "$str"
}

send_tg_notification() {
    local text="$1"
    local keyboard="$2"
    
    if [[ -n "${TOKEN:-}" && -n "${CHAT_ID:-}" ]]; then
        if [[ -n "$keyboard" ]]; then
            curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
                --form-string "chat_id=$CHAT_ID" \
                --form-string "text=$text" \
                --form-string "parse_mode=HTML" \
                --form-string "reply_markup=$keyboard" > /dev/null || true
        else
            curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
                --form-string "chat_id=$CHAT_ID" \
                --form-string "text=$text" \
                --form-string "parse_mode=HTML" > /dev/null || true
        fi
    fi
}

# =============================================================================
# BANNER
# =============================================================================

print_banner() {
    [[ "${SILENT}" == "true" ]] && return
    echo -e "${CBBLU}==============================================================================${CRESET}"
    echo -e "${CBWHT}   ██████╗ ███████╗██████╗ ██╗ █████╗ ███╗   ██╗                            ${CRESET}"
    echo -e "${CBWHT}   ██╔══██╗██╔════╝██╔══██╗██║██╔══██╗████╗  ██║                            ${CRESET}"
    echo -e "${CBWHT}   ██║  ██║█████╗  ██████╔╝██║███████║██╔██╗ ██║                            ${CRESET}"
    echo -e "${CBWHT}   ██║  ██║██╔══╝  ██╔══██╗██║██╔══██║██║╚██╗██║                            ${CRESET}"
    echo -e "${CBWHT}   ██████╔╝███████╗██████╔╝██║██║  ██║██║ ╚████║                            ${CRESET}"
    echo -e "${CBWHT}   ╚═════╝ ╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝                            ${CRESET}"
    echo -e "${CBBLU}==============================================================================${CRESET}"
    echo -e "      ${CBYLW}Golf Town Store Credit Portal — ENI Master Unified Runner${CRESET}"
    echo -e "         ${CBGRN}Debian / Ubuntu / Termux Android Compatible${CRESET}"
    echo -e "${CBBLU}==============================================================================${CRESET}"
    echo "" >&2
}

# =============================================================================
# UTILITIES
# =============================================================================

require() {
    if ! command -v "$1" &>/dev/null; then
        fail "Required binary '$1' not found in PATH."
        exit 1
    fi
}

kill_pidfile() {
    local pidfile=$1
    local sig=${2:-TERM}
    if [[ ! -f $pidfile ]]; then return 1; fi
    local pid=$(cat "$pidfile" 2>/dev/null)
    if [[ -z $pid ]]; then rm -f "$pidfile"; return 1; fi
    if kill -0 "$pid" 2>/dev/null; then
        kill "-${sig}" "$pid" 2>/dev/null || true
        rm -f "$pidfile"
        return 0
    fi
    rm -f "$pidfile"
    return 1
}

write_pidfile() {
    mkdir -p "$PID_DIR"
    echo "$1" > "${PID_DIR}/$2.pid"
}

state_get() {
    if [[ ! -f $STATE_FILE ]]; then echo ""; return; fi
    KEY="$1" python3 -c "import os, json; print(json.load(open('${STATE_FILE}')).get(os.environ.get('KEY',''),''))" 2>/dev/null || echo ""
}

state_put() {
    mkdir -p "$STATE_DIR"
    KEY="$1" VAL="$2" python3 -c "
import os, json
f = '${STATE_FILE}'
d = json.load(open(f)) if os.path.exists(f) else {}
d[os.environ.get('KEY')] = os.environ.get('VAL')
json.dump(d, open(f, 'w'), indent=2)
" 2>/dev/null || true
}

free_port() {
    local port=$1
    if command -v fuser &>/dev/null; then
        fuser -k "${port}/tcp" 2>/dev/null || true
    elif command -v lsof &>/dev/null; then
        local pid
        pid=$(lsof -t -i:"${port}" 2>/dev/null)
        if [[ -n "$pid" ]]; then
            kill -9 "$pid" 2>/dev/null || true
        fi
    fi
}

# =============================================================================
# AGGRESSIVE CLEANUP
# =============================================================================

nuke_everything() {
    sys "Terminating any existing server, tunnel, and worker processes..."

    for f in "${PID_DIR}"/*.pid; do
        [[ -f "$f" ]] || continue
        local pid=$(cat "$f" 2>/dev/null)
        [[ -n "$pid" ]] && kill -9 "$pid" 2>/dev/null || true
    done

    pkill -9 -f 'cloudflared tunnel' 2>/dev/null || true
    pkill -9 -x cloudflared 2>/dev/null || true
    pkill -9 -f 'php -S' 2>/dev/null || true
    pkill -9 -f 'npm run dev' 2>/dev/null || true
    pkill -9 -f 'node.*server' 2>/dev/null || true
    pkill -9 -f 'tsx server.ts' 2>/dev/null || true
    pkill -9 -f 'flask_admin.py' 2>/dev/null || true

    for port in 3000 8000 5000 1025; do
        free_port "$port"
    done

    rm -rf "$PID_DIR" "$STATE_DIR"
    mkdir -p "$PID_DIR" "$STATE_DIR"

    sleep 1
    ok "Clean slate — background services reset."
}

# =============================================================================
# ENVIRONMENT SETUP & DEPENDENCY PROVISIONING
# =============================================================================

IS_TERMUX=0
IS_DEBIAN=0

detect_environment() {
    if [ -d "/data/data/com.termux" ] || [ -n "${TERMUX_VERSION:-}" ] || [[ "${PREFIX:-}" == *"com.termux"* ]]; then
        IS_TERMUX=1
        ok "Environment Detected: Android Termux"
    elif [ -f /etc/debian_version ] || [ -f /etc/os-release ]; then
        IS_DEBIAN=1
        ok "Environment Detected: Debian/Ubuntu Linux"
    else
        info "Environment Detected: Generic Linux"
    fi
}

pre_flight() {
    sys "Running pre-flight checks..."
    require node
    require npm
    require curl
    require ps
    require python3
    ok "System pre-flight completed."
}

stuff_dependencies() {
    sys "Verifying system runtime & package dependencies..."

    if [ "$IS_TERMUX" == "1" ] || command -v pkg &>/dev/null; then
        info "Updating Termux packages..."
        pkg update -y 2>/dev/null || true
        local pkgs=("nodejs-lts" "git" "openssl-tool" "curl" "build-essential" "python" "make")
        for p in "${pkgs[@]}"; do
            pkg install -y "$p" 2>/dev/null || true
        done
    elif command -v apt-get &>/dev/null && [ "${EUID:-1}" -eq 0 ]; then
        info "Updating Debian/Ubuntu apt packages..."
        local missing=()
        for p in "curl" "git" "ca-certificates" "build-essential" "python3" "python3-pip" "python3-venv"; do
            if ! dpkg -s "$p" &>/dev/null; then missing+=("$p"); fi
        done
        if [[ ${#missing[@]} -gt 0 ]]; then
            DEBIAN_FRONTEND=noninteractive apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq "${missing[@]}" || warn "Failed to install some apt packages."
        fi
    fi

    fetch_cloudflared
    setup_python_venv
    setup_node_deps

    ok "Server environment fully provisioned."
}

fetch_cloudflared() {
    if command -v cloudflared &>/dev/null; then
        CF_BIN=$(command -v cloudflared)
        ok "cloudflared binary found ($CF_BIN)"
        return
    fi
    if [[ -f "${SCRIPT_DIR}/cloudflared" ]]; then
        CF_BIN="${SCRIPT_DIR}/cloudflared"
        ok "Local cloudflared binary ready ($CF_BIN)"
        return
    fi

    info "Downloading cloudflared..."
    local arch
    arch=$(uname -m 2>/dev/null || echo "x86_64")
    local cf_binary="cloudflared-linux-amd64"
    case "$arch" in
        aarch64|arm64) cf_binary="cloudflared-linux-arm64" ;;
        armv7l|arm) cf_binary="cloudflared-linux-arm" ;;
        i386|i686) cf_binary="cloudflared-linux-386" ;;
    esac

    curl -L "https://github.com/cloudflare/cloudflared/releases/latest/download/${cf_binary}" -o "${SCRIPT_DIR}/cloudflared" || {
        fail "Failed to download cloudflared (${cf_binary})."; exit 1
    }
    chmod +x "${SCRIPT_DIR}/cloudflared"
    CF_BIN="${SCRIPT_DIR}/cloudflared"
    ok "cloudflared downloaded and ready."
}

setup_python_venv() {
    if [ ! -d "${SCRIPT_DIR}/.venv" ]; then
        if ! python3 -m venv "${SCRIPT_DIR}/.venv" 2>/dev/null; then
            mkdir -p "${SCRIPT_DIR}/.venv/bin"
            ln -sf "$(command -v python3)" "${SCRIPT_DIR}/.venv/bin/python3"
        fi
    fi
    local req_file="${SCRIPT_DIR}/requirements.txt"
    if [ -f "$req_file" ]; then
        "${SCRIPT_DIR}/.venv/bin/python3" -m pip install -r "$req_file" --quiet --break-system-packages 2>/dev/null || true
    fi
}

setup_node_deps() {
    local node_modules="${SCRIPT_DIR}/node_modules"
    if [[ ! -d "$node_modules" ]]; then
        info "Installing Node dependencies..."
        if [ "$IS_TERMUX" == "1" ]; then
            npm install --no-audit --no-fund --legacy-peer-deps --unsafe-perm
        else
            npm install --no-audit --no-fund --legacy-peer-deps
        fi
        ok "Node dependencies installed."
    fi
}

# =============================================================================
# SERVICES LIFECYCLE
# =============================================================================

start_node() {
    info "Starting Node.js Gateway server on http://0.0.0.0:3000..."
    
    local run_static=false
    if [[ "${RUN_STATIC:-}" == "true" || "${RUN_MODE:-}" == "static" || "${RUN_MODE:-}" == "dev" || -f "${SCRIPT_DIR}/.static" ]]; then
        run_static=true
    fi

    if [[ "$run_static" == "true" ]]; then
        info "Running in development mode (npm run dev)..."
        (cd "$SCRIPT_DIR" && npm run dev > "${LOG_DIR}/main_app.log" 2>&1) &
    else
        if [[ ! -f "${SCRIPT_DIR}/dist/server.cjs" ]]; then
            info "Building production bundle (npm run build)..."
            (cd "$SCRIPT_DIR" && npm run build) || warn "Build step produced warnings."
        fi

        if [[ -f "${SCRIPT_DIR}/dist/server.cjs" ]]; then
            info "Launching production server (dist/server.cjs)..."
            (cd "$SCRIPT_DIR" && node dist/server.cjs > "${LOG_DIR}/main_app.log" 2>&1) &
        else
            info "Launching development server (npm run dev)..."
            (cd "$SCRIPT_DIR" && npm run dev > "${LOG_DIR}/main_app.log" 2>&1) &
        fi
    fi

    local pid=$!
    write_pidfile "$pid" "node_app"
    sleep 2

    if kill -0 "$pid" 2>/dev/null; then
        ok "Node.js Gateway is running (PID $pid)."
        return 0
    fi
    fail "Node.js Gateway failed to start. See main_app.log for details."
    return 1
}

start_php() {
    if ! command -v php &>/dev/null || [ ! -d "${SCRIPT_DIR}/remote_server" ]; then
        return 0
    fi
    info "Starting PHP service on port 8000..."
    free_port 8000
    sleep 0.5

    local router_arg=""
    if [[ -f "${SCRIPT_DIR}/remote_server/router.php" ]]; then
        router_arg="${SCRIPT_DIR}/remote_server/router.php"
    fi

    (cd "$SCRIPT_DIR" && php -S 0.0.0.0:8000 -t "${SCRIPT_DIR}/remote_server" $router_arg > "${LOG_DIR}/remote_mailer.log" 2>&1) &
    local pid=$!
    write_pidfile "$pid" "php_mailer"
    sleep 1

    if kill -0 "$pid" 2>/dev/null; then
        ok "PHP service active (PID $pid)."
    fi
}

# =============================================================================
# CLOUDFLARE TUNNEL LIFECYCLE
# =============================================================================

wait_tunnel_url() {
    local logfile=$1
    local timeout=$2
    local elapsed=0
    local url=""

    while [[ $elapsed -lt $timeout ]]; do
        if [[ -f "$logfile" ]]; then
            local clean_content
            clean_content=$(sed -e 's/\x1b\[[0-9;]*[a-zA-Z]//g' -e 's/\\//g' "$logfile" 2>/dev/null || cat "$logfile")

            url=$(echo "$clean_content" | grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' | head -n 1)

            if [[ -z "$url" ]]; then
                url=$(echo "$clean_content" | grep -oE 'https://[a-zA-Z0-9._-]+\.(trycloudflare\.com|cfargotunnel\.com)' | head -n 1)
            fi

            if [[ -n "$url" ]]; then
                url=$(echo "$url" | tr -d '\r\n\t ')
                echo "$url"
                return 0
            fi
        fi
        sleep 1
        elapsed=$((elapsed + 1))
    done

    return 1
}

start_tunnels() {
    info "Launching TryCloudflare HTTPS Quick Tunnel..."
    : > "${LOG_DIR}/tunnel_main.log"

    local cf_bin
    if command -v cloudflared &>/dev/null; then
        cf_bin="cloudflared"
    else
        cf_bin="${SCRIPT_DIR}/cloudflared"
    fi

    "$cf_bin" tunnel --url http://127.0.0.1:3000 > "${LOG_DIR}/tunnel_main.log" 2>&1 &
    local pid_main=$!
    write_pidfile "$pid_main" "tunnel_main"

    info "Negotiating secure tunnel connection with Cloudflare edge network..."
    MAIN_URL=$(wait_tunnel_url "${LOG_DIR}/tunnel_main.log" "$MAX_TUNNEL_WAIT") || true

    if [[ -n "$MAIN_URL" ]]; then
        echo "$MAIN_URL" > "${SCRIPT_DIR}/.cloudflare_url"
        state_put "tunnel_main" "$MAIN_URL"
        state_put "tunnel_started" "$(date --iso-8601=seconds)"

        echo "" >&2
        echo -e "${CBBLU}==============================================================================${CRESET}" >&2
        echo -e "${CBGRN}${CBOLD} 🎉 GOLF TOWN PORTAL ACTIVE & BROADCASTING GLOBALLY 🎉${CRESET}" >&2
        echo -e "${CBBLU}==============================================================================${CRESET}" >&2
        echo -e "  🖥️  Local Network:   ${CBBLU}${CBOLD}http://localhost:3000${CRESET}" >&2
        echo -e "  🔒  TryCloudflare:   ${CBGRN}${CBOLD}${MAIN_URL}${CRESET}" >&2
        echo -e "  📱  Deposit Portal:  ${CBGRN}${CBOLD}${MAIN_URL}/?session_id=LIVE-DEMO${CRESET}" >&2
        echo -e "${CBBLU}==============================================================================${CRESET}" >&2
        echo "" >&2

        local success_text="<b>GOLF TOWN STORE CREDIT PORTAL</b>"$'\n\n'"🚀 <b>System Active & Broadcasting!</b>"$'\n\n'"🔗 <b>Portal URL:</b> <code>${MAIN_URL}</code>"
        local keyboard="{\"inline_keyboard\": [[{\"text\": \"🔗 Open Portal\", \"url\": \"$MAIN_URL\"}]]}"
        send_tg_notification "$success_text" "$keyboard"
    else
        warn "Tunnel URL negotiation timed out. Check tunnel_main.log"
    fi
}

start_watchdog() {
    (
        while true; do
            sleep "$WATCHDOG_INTERVAL"
            if ! pgrep -f 'cloudflared tunnel.*3000' >/dev/null; then
                warn "Gateway tunnel offline. Re-establishing..."
                pkill -9 -f 'cloudflared tunnel' 2>/dev/null || true
                start_tunnels || true
            fi

            if ! curl -sf http://localhost:3000/api/health >/dev/null 2>&1 && ! curl -sf http://localhost:3000/ >/dev/null 2>&1; then
                warn "Node.js Gateway unresponsive. Restarting..."
                kill_pidfile "${PID_DIR}/node_app.pid" || true
                start_node || true
            fi
            state_put "last_watchdog_cycle" "$(date +%s)"
        done
    ) &
    local wd_pid=$!
    write_pidfile "$wd_pid" "watchdog"
    ok "Watchdog daemon monitoring system health (PID $wd_pid)."
}

# =============================================================================
# LOG ROTATION & STREAMING
# =============================================================================

rotate_logs() {
    mkdir -p "${LOG_DIR}/archive"
    for logf in main_app.log remote_mailer.log tunnel_main.log; do
        local logpath="${LOG_DIR}/${logf}"
        if [[ -s $logpath ]]; then
            cp "$logpath" "${LOG_DIR}/archive/${logf}_$(date +%Y%m%d%H%M%S)"
            : > "$logpath"
        fi
    done
}

print_status() {
    [[ "${SILENT}" == "true" ]] && return
    echo "" >&2
    echo -e "  ${CDKGREY}Managed Services:${CRESET}" >&2
    
    local node_pid
    node_pid=$(cat "${PID_DIR}/node_app.pid" 2>/dev/null || true)

    if [[ -n $node_pid ]] && kill -0 "$node_pid" 2>/dev/null; then
        echo -e "  ${CBGRN}●${CRESET}  Node.js Gateway   ${CDKGREY}port 3000${CRESET}  PID ${node_pid}" >&2
    else
        echo -e "  ${CRED}●${CRESET}  Node.js Gateway   ${CDKGREY}port 3000${CRESET}  ${CRED}offline${CRESET}" >&2
    fi

    echo "" >&2
    echo -e "  ${CDKGREY}Active Cloudflare Tunnel:${CRESET}" >&2
    if pgrep -f 'cloudflared tunnel.*3000' >/dev/null; then
        echo -e "  ${CBGRN}●${CRESET}  Main Tunnel URL: ${CBGRN}${MAIN_URL:-$(state_get tunnel_main)}${CRESET}" >&2
    else
        echo -e "  ${CRED}●${CRESET}  Main Tunnel: ${CRED}offline${CRESET}" >&2
    fi
    echo "" >&2
}

# =============================================================================
# COMMAND HANDLERS
# =============================================================================

cmd_start() {
    print_banner
    detect_environment
    stuff_dependencies
    pre_flight
    
    nuke_everything
    rotate_logs

    start_node || exit 1
    start_php || true
    start_tunnels || true
    start_watchdog

    state_put "status" "running"
    state_put "started_at" "$(date --iso-8601=seconds)"

    print_status

    if [[ "${DAEMON:-false}" == "true" ]]; then
        ok "System running in background daemon mode."
        return 0
    fi

    echo -e " Press ${CBOLD}CTRL+C${CRESET} to stop the application and close the tunnel."
    echo "" >&2

    trap shutdown_handler INT TERM
    while true; do sleep 3600; done
}

cmd_stop() {
    sys "Stopping Golf Town Portal services..."
    kill_pidfile "${PID_DIR}/watchdog.pid" || true
    pkill -f 'cloudflared tunnel' 2>/dev/null || true
    rm -f "${PID_DIR}/tunnel_main.pid"
    kill_pidfile "${PID_DIR}/php_mailer.pid" || true
    pkill -f 'php -S' 2>/dev/null || true
    kill_pidfile "${PID_DIR}/node_app.pid" || true
    pkill -f 'npm run dev' 2>/dev/null || true
    pkill -f 'node.*server' 2>/dev/null || true
    pkill -f 'tsx server.ts' 2>/dev/null || true
    
    state_put "status" "stopped"
    state_put "stopped_at" "$(date --iso-8601=seconds)"
    ok "All Golf Town Portal services stopped."
}

cmd_restart() {
    cmd_stop
    sleep 1
    cmd_start
}

cmd_build() {
    print_banner
    sys "Compiling frontend & backend bundle (npm run build)..."
    npm run build
    ok "Build completed successfully into dist/server.cjs"
}

cmd_status() {
    print_banner
    print_status
}

cmd_logs() {
    echo -e "${LINE}" >&2
    echo -e "${CBWHT}  TAILING APPLICATION LOGS ${CRESET}  ${CDKGREY}(Ctrl+C to exit)${CRESET}" >&2
    echo -e "${LINE}" >&2
    tail -f "${LOG_DIR}/main_app.log" "${LOG_DIR}/tunnel_main.log"
}

shutdown_handler() {
    echo "" >&2
    sys "Shutdown signal received..."
    cmd_stop
    exit 0
}

usage() {
    cat >&2 <<EOU
Usage:
  ./${SCRIPT_NAME} [start]    - Full auto-install & start of services and tunnels
  ./${SCRIPT_NAME} --install  - Force dependency setup & build
  ./${SCRIPT_NAME} --build    - Run production build
  ./${SCRIPT_NAME} stop       - Stop all portal services and tunnels
  ./${SCRIPT_NAME} restart    - Restart all portal services
  ./${SCRIPT_NAME} status     - View running status
  ./${SCRIPT_NAME} logs       - Tail application logs

EOU
}

# =============================================================================
# ENTRY POINT
# =============================================================================

main() {
    cd "$SCRIPT_DIR" || exit 1

    case ${1:-start} in
        start|start-bg) cmd_start ;;
        --install|-i)
            print_banner
            detect_environment
            stuff_dependencies
            cmd_build
            ok "Full installation and build complete! Run './run.sh' to launch."
            exit 0
            ;;
        --build|-b|build) cmd_build ;;
        stop|kill) cmd_stop ;;
        restart) cmd_restart ;;
        status) cmd_status ;;
        logs) cmd_logs ;;
        help|--help|-h) usage ;;
        *)
            fail "Unknown command: ${1:-}"
            usage
            exit 1
            ;;
    esac
}

main "$@"
