# 🔗 URL Shortener

This is a lightweight and extensible **URL Shortener API** built with **Node.js** and **Express.js**, supporting:

- URL shortening with optional custom shortcodes
- Expiry duration for shortened URLs
- Click tracking with metadata (timestamp, referrer, IP)
- Integration with an external logging service via Bearer token

---

## 📦 Features

- 🔗 Generate short URLs
- 🕒 Set expiry duration (default: 30 minutes)
- 📊 Track usage statistics
- 📥 Redirect users to original URLs
- 📡 External API logging (info, warnings, errors)

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+ recommended)
- Internet access (for logging API)

---

### 📁 Installation

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
npm install
