#!/usr/bin/env bash
# =============================================================================
# run.sh - Master Supervisor & Unified Runner for Golf Town / ENI Portal
# =============================================================================
# Optimized for AI Studio Build environment
# Supports Debian/Ubuntu Linux
# =============================================================================

set -o nounset
set -o pipefail

# =============================================================================
# CONSTANTS & CONFIGURATION
# =============================================================================

readonly SCRIPT_NAME=$(basename "$0")
readonly SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}

# Load local .env variables if present
if [[ -f "${SCRIPT_DIR}/.env" ]]; then
    set -a
    source "${SCRIPT_DIR}/.env"
    set +a
fi

# =============================================================================
# COLORS
# =============================================================================

if [[ -t 1 ]]; then
    readonly CRESET='\033[0m'
    readonly CBOLD='\033[1m'
    readonly CRED='\033[0;31m'
    readonly CGRN='\033[0;32m'
    readonly CYLW='\033[0;33m'
    readonly CBLU='\033[0;34m'
    readonly CWHT='\033[0;37m'
    readonly CBGRN='\033[1;32m'
    readonly CBYLW='\033[1;33m'
    readonly CBBLU='\033[1;34m'
    readonly CBWHT='\033[1;37m'
else
    readonly CRESET='' CBOLD='' CRED='' CGRN='' CYLW='' CBLU='' CWHT=''
    readonly CBGRN='' CBYLW='' CBBLU='' CBWHT=''
fi

readonly SYM_OK="${CBGRN}✓${CRESET}"
readonly SYM_FAIL="${CRED}✗${CRESET}"
readonly SYM_WARN="${CBYLW}⚠${CRESET}"
readonly SYM_INFO="${CBBLU}ℹ${CRESET}"

info()  { echo -e " ${SYM_INFO}  $*" >&2; }
ok()    { echo -e " ${SYM_OK}  $*" >&2; }
warn()  { echo -e " ${SYM_WARN}  $*" >&2; }
fail()  { echo -e " ${SYM_FAIL}  $*" >&2; }

# =============================================================================
# BANNER
# =============================================================================

print_banner() {
    # Clear terminal if possible, but suppress errors if TERM is not set
    clear 2>/dev/null || printf "\033c" || true
    echo -e "${CBBLU}==============================================================================${CRESET}"
    echo -e "${CBWHT} ██████╗  ██████╗ ██╗     ███████╗████████╗ ██████╗ ██╗    ██╗███╗   ██╗██╗ ${CRESET}"
    echo -e "${CBWHT}██╔════╝ ██╔═══██╗██║     ██╔════╝╚══██╔══╝██╔═══██╗██║    ██║████╗  ██║██║ ${CRESET}"
    echo -e "${CBWHT}██║  ███╗██║   ██║██║     █████╗     ██║   ██║   ██║██║ █╗ ██║██╔██╗ ██║██║ ${CRESET}"
    echo -e "${CBWHT}██║   ██║██║   ██║██║     ██╔══╝     ██║   ██║   ██║██║███╗██║██║╚██╗██║╚═╝ ${CRESET}"
    echo -e "${CBWHT}╚██████╔╝╚██████╔╝███████╗██║        ██║   ╚██████╔╝╚███╔███╔╝██║ ╚████║██╗ ${CRESET}"
    echo -e "${CBWHT} ╚═════╝  ╚═════╝ ╚══════╝╚═╝        ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚═╝ ${CRESET}"
    echo -e "${CBBLU}==============================================================================${CRESET}"
    echo -e "      ${CBYLW}Golf Town Store Credit Portal — ENI Master Unified Runner${CRESET}"
    echo -e "         ${CBGRN}AI Studio Build Container Optimized${CRESET}"
    echo -e "${CBBLU}==============================================================================${CRESET}"
    echo "" >&2
}

# =============================================================================
# COMMANDS
# =============================================================================

cmd_start() {
    print_banner
    info "Starting Portal Services..."
    info "Environment: ${CBOLD}${NODE_ENV}${CRESET}"
    info "Port:        ${CBOLD}${PORT}${CRESET}"
    info "URL:         ${CBGRN}${APP_URL:-http://localhost:3000}${CRESET}"

    # Suppress "unknown cli config --unsafe-perm" warning by explicitly unsetting it
    # In npm 7+, this config is deprecated and triggers a warning on every command if present
    npm config delete unsafe-perm &>/dev/null || true
    
    # Enable scripts for packages that require them (e.g. @google/genai)
    npm config set allow-scripts true &>/dev/null || true

    # Suppress non-critical audit/fund/deprecation noise
    export NPM_CONFIG_AUDIT=false
    export NPM_CONFIG_FUND=false
    export NPM_CONFIG_LOGLEVEL=error

    # Ensure dependencies are installed if node_modules is missing
    if [[ ! -d "${SCRIPT_DIR}/node_modules" ]]; then
        info "Installing dependencies..."
        npm install --no-audit --no-fund --legacy-peer-deps
    fi

    # Launch TryCloudflare tunnel before starting server.ts / dev server
    # cmd_tunnel_start || true

    if [[ "${NODE_ENV}" == "production" ]]; then
        if [[ ! -f "${SCRIPT_DIR}/dist/server.cjs" ]]; then
            info "Production bundle not found. Building..."
            npm run build
        fi
        ok "Launching production server (dist/server.cjs)..."
        exec node dist/server.cjs
    else
        ok "Launching development server (npm run dev)..."
        exec npm run dev
    fi
}

cmd_build() {
    print_banner
    info "Compiling frontend & backend bundle (npm run build)..."
    npm run build
    ok "Build completed successfully."
}

cmd_status() {
    print_banner
    local running=false
    if pgrep -f 'node dist/server.cjs' >/dev/null; then
        ok "Portal Service: ${CBGRN}RUNNING${CRESET} (Production Mode)"
        running=true
    elif pgrep -f 'tsx server.ts' >/dev/null || pgrep -f 'vite' >/dev/null; then
        ok "Portal Service: ${CBGRN}RUNNING${CRESET} (Development Mode)"
        running=true
    else
        warn "Portal Service: ${CRED}OFFLINE${CRESET}"
    fi

    if [[ "$running" == "true" ]]; then
        info "Access URL: ${CBGRN}${APP_URL:-http://localhost:3000}${CRESET}"
    fi
}

cmd_stop() {
    info "Stopping all portal services..."
    pkill -f 'node dist/server.cjs' 2>/dev/null || true
    pkill -f 'tsx server.ts' 2>/dev/null || true
    pkill -f 'vite' 2>/dev/null || true
    pkill -f 'cloudflared tunnel' 2>/dev/null || true
    rm -f .cloudflare_url .cloudflare_log 2>/dev/null
    ok "Services stopped."
}

cmd_tunnel_start() {
    info "Preparing TryCloudflare Tunnel..."
    local CLOUDFLARED_BIN="./cloudflared"
    
    # 1. Check if cloudflared exists, if not, download it
    if ! command -v cloudflared &>/dev/null; then
        if [[ ! -f "$CLOUDFLARED_BIN" ]]; then
            info "Downloading cloudflared binary for Linux..."
            local ARCH=$(uname -m)
            local URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
            if [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then
                URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
            fi
            
            if curl -L -f -s "$URL" -o "$CLOUDFLARED_BIN"; then
                chmod +x "$CLOUDFLARED_BIN"
                ok "Downloaded and configured cloudflared."
            else
                fail "Failed to download cloudflared binary."
                exit 1
            fi
        fi
    else
        CLOUDFLARED_BIN="cloudflared"
    fi

    # 2. Kill any existing tunnel first
    pkill -f "cloudflared tunnel" &>/dev/null || true
    rm -f .cloudflare_url .cloudflare_log 2>/dev/null

    # 3. Launch cloudflared tunnel pointing at the local app URL
    info "Starting TryCloudflare tunnel for http://127.0.0.1:${PORT}..."
    nohup "$CLOUDFLARED_BIN" tunnel --url "http://127.0.0.1:${PORT}" > .cloudflare_log 2>&1 &
    
    # 4. Wait & extract the assigned .trycloudflare.com URL from logs
    local count=0
    local max_wait=40
    local found_url=""
    
    while [[ $count -lt $max_wait ]]; do
        sleep 1
        if [[ -f .cloudflare_log ]]; then
            found_url=$(grep -o -E 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' .cloudflare_log | head -n 1)
            if [[ -n "$found_url" ]]; then
                echo -n "$found_url" > .cloudflare_url
                ok "TryCloudflare Tunnel is live: ${CBGRN}${found_url}${CRESET}"
                return 0
            fi
        fi
        count=$((count + 1))
    done

    fail "Tunnel started but failed to retrieve public trycloudflare URL within ${max_wait}s."
    exit 1
}

cmd_tunnel_stop() {
    info "Stopping TryCloudflare Tunnel..."
    pkill -f "cloudflared tunnel" &>/dev/null || true
    rm -f .cloudflare_url .cloudflare_log 2>/dev/null
    ok "TryCloudflare Tunnel stopped and cleaned up."
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    cd "$SCRIPT_DIR" || exit 1

    case ${1:-start} in
        start) cmd_start ;;
        build|--build) cmd_build ;;
        status) cmd_status ;;
        stop|kill) cmd_stop ;;
        tunnel-start) cmd_tunnel_start ;;
        tunnel-stop) cmd_tunnel_stop ;;
        restart)
            cmd_stop
            sleep 1
            cmd_start
            ;;
        help|--help|-h)
            echo "Usage: ./${SCRIPT_NAME} [start|build|status|stop|tunnel-start|tunnel-stop|restart|help]"
            ;;
        *)
            fail "Unknown command: ${1}"
            exit 1
            ;;
    esac
}

main "$@"
