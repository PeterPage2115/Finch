# 🎉 Finch v1.0.0 - Release Notes

**Release Date:** October 8, 2025  
**GitHub:** https://github.com/PeterPage2115/Finch  
**Tag:** v1.0.0

---

## 🐦 Welcome to Finch!

Finch is an open-source personal finance tracker designed for **privacy** and **simplicity**. Self-host it with Docker Compose and keep your financial data under your control.

### 🌟 What's New in v1.0.0

#### **Rebranding**
- 🆕 **New Name:** "Finch" (previously "Tracker Kasy")
- 🌍 **International Focus:** English branding for global accessibility
- 🇵🇱 **Polish UI Maintained:** Default language remains Polish (i18n coming in v1.1)

#### **Production-Ready Features**
- ✅ **Complete Financial Tracking:** Income, expenses, categories, budgets
- ✅ **Interactive Reports:** Click pie chart segments to view transaction details
- ✅ **Dark Mode:** Full theme support with persistent toggle
- ✅ **Export:** PDF & CSV reports with proper UTF-8 Polish character support
- ✅ **Authentication:** JWT-based auth with email notifications
- ✅ **Self-Hosted:** Deploy with `docker-compose up` - no cloud dependencies

#### **Technical Excellence**
- 🧪 **88 Backend Tests:** 100% service coverage with Jest
- 🔒 **0 Vulnerabilities:** Clean npm audit on both frontend and backend
- 🐳 **Docker Optimized:** Multi-stage builds, health checks, auto-restart
- 📚 **800+ Lines of Docs:** Complete API reference, deployment guide, CHANGELOG

---

## 🐛 Critical Bugs Fixed in Final Testing

### 1. **BudgetForm Crash on Manual Date Input** (CRITICAL)
**Problem:** Runtime error when user typed partial date (e.g., "01")
```
Error: RangeError: Invalid time value
```
**Fix:** Added date validation before `toISOString()` in useEffect
```typescript
if (!isNaN(end.getTime())) {
  setFormData((prev) => ({
    ...prev,
    endDate: end.toISOString().split('T')[0],
  }));
}
```
**Commit:** `6ca0837`

### 2. **Emoji Remnants in CategoryForm**
**Problem:** 💸 💰 emoji still visible in expense/income buttons
**Fix:** Replaced with Lucide icons (`TrendingDown`, `TrendingUp`)
```tsx
<button>
  <TrendingDown size={18} />
  Wydatek
</button>
```
**Commit:** `6ca0837`

### 3. **Zero Not Cleared in Amount Input**
**Problem:** Typing "4300" showed "04300" because zero didn't disappear
**Fix:** Added onFocus handler to select text when amount is 0
```typescript
onFocus={(e) => {
  if (formData.amount === 0) {
    e.target.select();
  }
}}
```
**Commit:** `6ca0837`

### 4. **Polish Characters Broken in PDF Export**
**Problem:** 
- PLN currency symbol rendered without the diacritic
- The Polish word "Wyplata" rendered as "Wy[garbage]ata"
- PDFKit default fonts don't support UTF-8

**Solution:** Installed Liberation Sans font in Docker
```dockerfile
RUN apk add --no-cache ttf-liberation
```
```typescript
doc.font('/usr/share/fonts/liberation/LiberationSans-Regular.ttf');
```
**Commits:** `9a44ccc`, `9347ffe`

### 5. **Backend Container Restart Loop**
**Problem:** Prisma error on startup - manual migration folder breaking conventions
```
Error: P3015
Could not find the migration file at migration.sql
```
**Fix:** Removed `backend/prisma/migrations/manual/` folder
**Commit:** `fc8d834`

---

## 📦 What's Included

### **Core Features**
- 💰 **Transaction Management:** Add, edit, delete income/expense records
- 📂 **Categories:** Custom categories with colors and Lucide icons
- 💼 **Budgets:** Set monthly/weekly limits with progress tracking
- 📊 **Reports:** 
  - Summary (income vs expenses, balance)
  - By Category (pie chart with click-to-detail)
  - Trends over time
  - CSV & PDF export
- 🌙 **Dark Mode:** Complete theme support
- 🔐 **Authentication:** Register, login, password reset via email
- 📧 **Email Service:** SMTP support for notifications

### **Technical Stack**
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend:** NestJS, TypeScript, Prisma ORM
- **Database:** PostgreSQL 17
- **Containerization:** Docker & Docker Compose
- **Testing:** Jest (88 tests)
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** Zustand

### **Documentation**
- 📖 [README.md](../README.md) - Project overview
- 📝 [CHANGELOG.md](../CHANGELOG.md) - Full version history
- 🔧 [API.md](./API.md) - API reference
- 🗄️ [DATABASE.md](./DATABASE.md) - Schema documentation
- 🐳 [DOCKER.md](../DOCKER.md) - Deployment guide
- 🤝 [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

---

## 🚀 Quick Start

### **Prerequisites**
- Docker & Docker Compose
- Git

### **Deployment**

1. **Clone the repository:**
```bash
git clone https://github.com/PeterPage2115/Finch.git
cd Finch
```

2. **Configure environment:**
```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env

# Edit .env files with your settings (SMTP, JWT secret, etc.)
```

3. **Start the application:**
```bash
docker-compose up -d
```

4. **Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

5. **Initial setup:**
- Register a new account
- Start tracking your finances!

---

## 📊 Project Statistics

- **Total Commits:** 21
- **Files:** 150+
- **Lines of Code:** ~15,000
- **Lines of Documentation:** 800+
- **Backend Tests:** 88 (100% service coverage)
- **Security Vulnerabilities:** 0
- **Docker Images:** 3 (frontend, backend, database)
- **Development Time:** ~2 weeks intensive work

---

## 🔮 Roadmap (v1.1+)

- 🌍 **i18n Support:** Full internationalization (English, Polish, more)
- 📱 **Mobile Responsive:** Enhanced mobile experience
- 📈 **Advanced Analytics:** More chart types, trend analysis
- 🔄 **Recurring Transactions:** Auto-add monthly bills
- 📎 **Attachments:** Upload receipts/invoices
- 🏷️ **Tags:** Multi-dimensional transaction categorization
- 🔔 **Notifications:** Budget alerts, reminders
- 💾 **Data Backup:** Automated backup system

---

## 🙏 Acknowledgments

Built with modern web technologies and a focus on:
- **Privacy:** Your data, your server
- **Simplicity:** Easy to deploy and use
- **Quality:** Well-tested, documented, secure

Special thanks to the open-source community for:
- Next.js, NestJS, Prisma, PostgreSQL
- Lucide icons, Recharts, Tailwind CSS
- Liberation Fonts for UTF-8 support

---

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details

---

## 🐛 Found a Bug?

Please report issues at: https://github.com/PeterPage2115/Finch/issues

---

## 💬 Questions or Feedback?

Open a discussion: https://github.com/PeterPage2115/Finch/discussions

---

**Thank you for using Finch! 🐦**

Happy tracking! 💰📊
