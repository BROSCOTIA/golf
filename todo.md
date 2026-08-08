# Golf Town Store Credit & Customer Insights Portal — Project Roadmap & TODO

## 📌 Executive Overview
This portal manages store credit balances, refund notices, gender demographics, and customer insights across Golf Town locations (focusing on Store 504 - South Calgary and broad Canadian store networks).

---

## 1. ⚙️ Core System Architecture & Deployment
- [x] **Unified Master Runner (`run.sh`)**: Single bash runner script compatible with Debian/Ubuntu Linux and Termux Android.
- [x] **TryCloudflare Tunneling**: Automated background tunnel creation for secure public HTTPS broadcasting.
- [x] **Full-Stack Bundling (`dist/server.cjs`)**: Esbuild compilation for Express backend with Vite SPA frontend assets.
- [x] **Lightweight Memory/JSON State**: Local state management with optional Drizzle ORM / SQLite / PostgreSQL adapter hooks.
- [x] **Input Sanitization & Security Hardening**: Express payload handling with compression and CORS checks.

---

## 2. 💳 Store Credit & Customer Record Management
- [x] **Multi-Store Customer Sanitization**: Automated data sanitizer cleaning phone numbers, names, and store identifiers.
- [x] **Gender Classification Engine**: Name-based gender prediction with manual correction options via `CustomerNameInsightModal`.
- [x] **Store Credit Aging Tracker**: Categorize store credit balances into 0–30, 31–60, 61–90, and 90+ day aging buckets.
- [x] **Customer History Export**: Export customer store credit records to XLSX and CSV formats.

---

## 3. ✉️ Refund Issuance & Email Dispatcher
- [x] **Nodemailer SMTP Integration**: Automated dispatch of official Golf Town store credit refund notices via SMTP.
- [x] **Interactive Receipt Generator**: Custom receipt refund modal (`CustomReceiptRefundModal`) generating unique store credit balance codes.
- [x] **Email Form Previewer**: Live modal previewing customer email templates prior to dispatch (`EmailFormPreviewModal`).
- [x] **Email Delivery Audit Logs**: Persistent logging of sent refund notices with timestamp, recipient email, and delivery status.

---

## 4. 🌐 Customer Portal & Deposit Verification
- [x] **Dedicated Customer View (`CustomerPortalView`)**: Token-authenticated portal for customers to view active store credit, verify balances, and request refunds.
- [x] **Deposit Token Handling**: URL parameter session parsing (`session_id`, `deposit_token`, `amount`).
- [x] **Interac e-Transfer Verification**: Direct portal support for deposit processing and credit claim verification.

---

## 5. 🔔 Real-Time Sockets & Automated Alerts
- [x] **Live Socket Admin Modal**: Real-time event monitor (`LiveSocketAdminModal`) for tracking active store credit transactions.
- [x] **Automated High-Value Alerts**: Alert threshold configuration modal (`AutomatedAlertsModal`).
- [x] **Telegram Bot Webhook Config**: Configuration file (`telegram-config.json`) and webhook handlers for real-time store manager notifications.
- [x] **Push & Webhook Notification Support**: Background notification handler for high-priority store credit approvals.

---

## 6. 📊 Analytics & Visual Reporting
- [x] **Recharts Demographic & Aging Analytics**: Interactive chart breakdown (`StoreCreditAnalyticsModal`) for gender distribution, credit metrics, and store comparison.
- [x] **Store Location Map Locator**: Store locator modal (`StoreMapModal`) featuring store addresses, contact info, and store numbers.
- [x] **Store Credit Policy Guide**: Regulatory and policy viewer (`StoreCreditPolicyModal`).

---

## 7. 📱 Mobile & Responsive UI
- [x] **Mobile Bottom Navigation**: Bottom tab bar (`MobileBottomNav`) for seamless phone/tablet operation.
- [x] **Mobile Contact Cards**: Clean card views (`MobileContactCard`) optimized for touch screens.
- [x] **XLSX Bulk Upload**: Spreadsheet importer (`XlsxUploadModal`) for quick customer list ingestion.

