# 📋 TODO - Current Sprint

> **Current Version:** v0.8.0 Complete ✅  
> **Next Priority:** v0.9.0 Advanced Reports

---

## 🎯 In Progress

- [ ] **v0.9.0: Advanced Reports** - Date ranges, CSV/PDF export, custom filters

---

## ⏭️ Next Up (Prioritized)

1. [x] **v0.8.0-alpha: Core Authentication** ✅ (Complete)
   - User profile management (GET /auth/me, PATCH /auth/profile)
   - Password change endpoint (PATCH /auth/change-password)
   - Frontend: Profile page + change password form

2. [x] **v0.8.0-beta: Password Reset** ✅ (Complete)
   - Prisma: PasswordResetToken model with expiration
   - Backend: POST /auth/forgot-password, POST /auth/reset-password
   - Frontend: /forgot-password and /reset-password/[token] pages
   - Token-based password recovery flow

3. [x] **v0.8.0-rc: Email Service** ✅ (Complete)
   - NodeMailer integration with Ethereal.email (dev mode)
   - HTML email templates for password reset
   - Production-ready SMTP configuration

---

## 🔮 Future Sprints (Backlog)

- [ ] **v0.9.0: Advanced Reports** - Date ranges, CSV/PDF export, custom filters
- [ ] **v1.0: Production Ready** - Security audit, performance optimization, monitoring
- [ ] **v1.1: Multi-currency** - Support for multiple currencies with real-time exchange rates
- [ ] **v1.2: Recurring Transactions** - Auto-create monthly bills, subscriptions
- [ ] **v1.3: Savings Goals** - Track progress toward financial goals

---

📜 **Detailed roadmap:** [ROADMAP.md](./ROADMAP.md)  
✅ **Completed milestones:** [COMPLETED.md](./COMPLETED.md)  
📝 **Full changelog:** [CHANGELOG.md](./CHANGELOG.md)
