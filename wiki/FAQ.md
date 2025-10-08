# FAQ - Frequently Asked Questions

## General Questions

### What is Finch?

Finch is an open-source, self-hosted personal finance management application. It helps you track income, expenses, budgets, and analyze your financial data - all while keeping your data private on your own server.

### Why choose Finch over other finance apps?

- **Privacy:** Your data stays on YOUR server
- **Open Source:** Fully transparent, no vendor lock-in
- **Self-Hosted:** Complete control over your data
- **Free:** No subscriptions or hidden costs
- **Modern:** Built with latest technologies

### Is Finch free?

Yes! Finch is completely free and open-source under the MIT license. You can use it, modify it, and even use it commercially without any costs.

### What does "self-hosted" mean?

Self-hosted means YOU run the application on YOUR own server (or even your personal computer). Unlike cloud services, your financial data never leaves your control.

## Technical Questions

### What are the system requirements?

**Minimum:**
- Docker 20.10+
- 2 CPU cores
- 2 GB RAM
- 10 GB disk space

**Recommended:**
- 4 CPU cores
- 4 GB RAM
- 20 GB disk space

### Do I need to know programming to use Finch?

No! Installation is simple with Docker Compose (one command). However, basic command-line knowledge is helpful.

### Can I run Finch on a Raspberry Pi?

Yes! Finch works on ARM architectures. Use Docker Compose and it should work on Raspberry Pi 4 or newer.

### What browsers are supported?

Finch works on all modern browsers:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Can I access Finch from my phone?

Yes! The interface is responsive and works on mobile browsers. There's no native mobile app yet.

## Data & Privacy

### Where is my data stored?

All data is stored in a PostgreSQL database on YOUR server. Nothing is sent to external servers.

### Is my data encrypted?

- Passwords are hashed using bcrypt
- Data in transit uses HTTPS (when configured)
- Database encryption depends on your PostgreSQL configuration

### Can I export my data?

Yes! You can:
- Export reports to CSV/PDF
- Backup the entire PostgreSQL database
- Access data via the API

### How do I backup my data?

See the [Backup & Restore](Backup-Restore) guide for detailed instructions.

## Features

### Is there multi-user support?

Currently, each user has their own account with separate data. There's no family/shared account feature yet (planned for v1.2).

### Can I import data from other apps?

CSV import is planned for v1.1. Currently, you need to add transactions manually or use the API.

### Is there a mobile app?

Not yet. The web interface is mobile-responsive. Native apps are on the roadmap for v2.0.

### What currencies are supported?

Currently optimized for PLN (Polish Złoty), but you can use any currency. Multi-currency support is planned for v1.1.

### Can I set recurring transactions?

Not yet. This feature is planned for v1.2.

## Installation & Setup

### Installation failed, what should I do?

1. Check Docker is running: `docker --version`
2. Check logs: `docker-compose logs`
3. Verify ports 3000, 3001, 5432 are available
4. See [Troubleshooting](Troubleshooting) guide

### How do I change the port?

Edit `docker-compose.yml` and change the port mappings:

```yaml
services:
  frontend:
    ports:
      - "8080:3000"  # Change 3000 to your desired port
```

### Can I use an existing PostgreSQL database?

Yes! Just update the `DATABASE_URL` in `.env` to point to your existing PostgreSQL instance.

### How do I enable HTTPS?

Use a reverse proxy like nginx or Caddy. See [Docker Configuration](Docker-Configuration) for examples.

## Updates & Maintenance

### How do I update Finch?

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

See [Installation Guide](Installation-Guide#updates) for details.

### Will my data be lost when updating?

No, as long as you don't delete the PostgreSQL volume. Always backup before major updates!

### How often should I update?

Check for updates monthly, or subscribe to GitHub releases for notifications.

## Troubleshooting

### Backend container keeps restarting

Check logs:
```bash
docker-compose logs backend
```

Common causes:
- Incorrect `DATABASE_URL`
- Database not ready
- Missing environment variables

### Frontend shows "Network Error"

1. Check `NEXT_PUBLIC_API_URL` in `.env`
2. Verify backend is running: `docker-compose ps`
3. Check backend logs: `docker-compose logs backend`

### "Port already in use" error

Another service is using ports 3000, 3001, or 5432. Either:
- Stop the conflicting service
- Change ports in `docker-compose.yml`

### More issues?

See [Troubleshooting](Troubleshooting) guide or [open an issue](https://github.com/PeterPage2115/Finch/issues).

## Contributing

### How can I contribute?

- Report bugs on GitHub
- Suggest features
- Submit pull requests
- Improve documentation
- Translate to other languages

See [Contributing Guide](Contributing) for details.

### I found a security issue, what should I do?

**Do NOT open a public issue!** Email: piotr.paz04@gmail.com

See [Security Policy](https://github.com/PeterPage2115/Finch/security/policy).

## Licensing

### What license does Finch use?

MIT License - you can use it freely, modify it, and even use it commercially.

### Can I use Finch for my business?

Yes! The MIT license allows commercial use.

---

**Last Updated:** October 8, 2025  
**Didn't find your answer?** [Open an issue](https://github.com/PeterPage2115/Finch/issues) on GitHub!
