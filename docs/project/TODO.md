# 📋 TODO - Current Sprint

> **Current Version:** v0.7.0 Complete ✅  
> **Next Priority:** Technical Documentation + v0.8.0 Real Authentication

---

## 🎯 In Progress

- [ ] **Technical Documentation** - Create docs/technical/ structure (5 files)
  - TECH_STACK.md, ARCHITECTURE.md, DEVELOPMENT_GUIDE.md, TESTING_STRATEGY.md, API_REFERENCE.md

---

## ⏭️ Next Up (Prioritized)

1. [ ] **v0.8.0-alpha: Core Authentication** (1 day)
   - Bcrypt password hashing
   - Real JWT generation (access + refresh tokens)
   - User profile endpoints (GET/PATCH `/api/auth/profile`)
   - Change password endpoint
   - Frontend: Profile page + forms

2. [ ] **v0.8.0-beta: Password Reset** (0.5 day)
   - Password reset tokens in Prisma schema
   - Email flow: forgot-password → reset-password
   - Frontend: Password reset pages

3. [ ] **v0.8.0-rc: Email Service** (0.5 day)
   - NodeMailer setup (SMTP)
   - Email templates (password reset)
   - Dev: ethereal.email (testing)

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
