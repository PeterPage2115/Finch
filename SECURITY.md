# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Finch seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:
- Open a public GitHub issue
- Disclose the vulnerability publicly before it has been addressed

### Please DO:
1. **Email us directly** at: [piotr.paz04@gmail.com](mailto:piotr.paz04@gmail.com)
2. **Include the following information:**
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### What to expect:
- **Acknowledgment:** We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates:** We will send you regular updates about our progress
- **Disclosure:** We will work with you to understand and resolve the issue before any public disclosure
- **Credit:** We will publicly acknowledge your responsible disclosure (if you wish)

## Security Update Process

1. The security report is received and assigned to a primary handler
2. The problem is confirmed and a list of affected versions is determined
3. Code is audited to find any potential similar problems
4. Fixes are prepared for all supported releases
5. Fixes are released and announcements are made

## Best Practices for Self-Hosting

When self-hosting Finch, please follow these security best practices:

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords for `JWT_SECRET` and database credentials
- Rotate secrets regularly

### Docker Security
- Keep Docker and Docker Compose updated
- Use Docker secrets for sensitive data in production
- Limit container resources and capabilities

### Network Security
- Use HTTPS in production (configure reverse proxy like nginx)
- Implement rate limiting
- Keep PostgreSQL port (5432) closed to external access
- Use firewall rules to restrict access

### Database Security
- Use strong PostgreSQL passwords
- Regularly backup your database
- Keep PostgreSQL updated to the latest stable version
- Limit database user permissions

### Updates
- Regularly update Finch to the latest version
- Subscribe to repository releases for security announcements
- Monitor Dependabot alerts

## Security Features

Finch includes the following security features:

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt with salt for password storage
- **SQL Injection Protection:** Prisma ORM with parameterized queries
- **XSS Protection:** React's built-in escaping
- **CORS Configuration:** Configurable origin restrictions
- **Environment Isolation:** Separate dev/prod configurations

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

---

**Last Updated:** October 8, 2025
