# 📋 TODO - Current Sprint

> **Last Updated:** October 9, 2025  
> **Sprint Focus:** Post-v1.0.0 Cleanup & Planning

---

## 🔥 In Progress

### Documentation
- [ ] Update TECH_STACK.md with current package versions
- [ ] Archive RELEASE_v1.0.0.md (keep local only, GitHub release exists)

---

## 📅 This Week

### Code Quality
- [x] Fix PowerShell script encoding issues (emoji → ASCII)
- [x] Fix Docker image rebuild in reset-database.ps1
- [x] Translate default categories to English
- [x] Clean up obsolete scripts

### Project Organization
- [x] Create docs/project/ for tracking files
- [x] Update .gitignore for local files (memory.json, ROADMAP_*.md)
- [x] Move seed-test-data.ps1 to backend/scripts/

---

## 🎯 Next Sprint (v1.1 Planning)

### High Priority Features
- [ ] Split Transactions (2-3 weeks)
  - [ ] Database schema (TransactionSplit model)
  - [ ] Backend service layer
  - [ ] Frontend UI (split form)
  - [ ] Tests (unit + integration)

- [ ] CSV Import (1-2 weeks)
  - [ ] Backend import service
  - [ ] Frontend upload UI
  - [ ] Column mapping
  - [ ] Error handling

- [ ] Rules Engine (3-4 weeks)
  - [ ] Database schema (Rule model)
  - [ ] Backend rule evaluation
  - [ ] Frontend rules management UI
  - [ ] Auto-apply on transaction create

### Already Planned
- [ ] Recurring Transactions
- [ ] Tags
- [ ] Attachments
- [ ] Multi-currency
- [ ] i18n Support (EN/PL)

---

## 🐛 Bugs & Issues

_No critical bugs reported_

---

## 💡 Ideas / Backlog

- API documentation (Swagger/OpenAPI)
- Goals/Savings tracking
- Performance optimizations (query indexes)
- Mobile app (React Native) - v2.0

---

## ✅ Quick Wins

- [ ] Add seed script README with usage instructions
- [ ] Document reset-database.ps1 in CONTRIBUTING.md
- [ ] Update screenshots with English categories

---

**Note:** Keep this file short and actionable. Move completed items to COMPLETED.md weekly.
