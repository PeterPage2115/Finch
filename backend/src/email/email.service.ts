import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter | null = null;

  /**
   * Inicjalizacja transportera email po starcie modułu
   */
  async onModuleInit() {
    await this.initializeTransporter();
  }

  /**
   * Konfiguracja SMTP transportera
   * - Produkcja: użyj prawdziwego SMTP z zmiennych środowiskowych
   * - Development: użyj Ethereal Email (testowy inbox)
   */
  private async initializeTransporter() {
    if (process.env.NODE_ENV === 'production') {
      // Production: Real SMTP server
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('📧 Email service initialized (Production SMTP)');
    } else {
      // Development: Ethereal Email (fake SMTP with preview)
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Email service initialized (Ethereal Test Account)');
      console.log(`   User: ${testAccount.user}`);
      console.log('   Check emails at: https://ethereal.email');
    }
  }

  /**
   * Wysyła email z linkiem do resetowania hasła
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      color: #4F46E5;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4F46E5;
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #4338CA;
    }
    .link-box {
      background-color: #f9fafb;
      padding: 12px;
      border-radius: 4px;
      word-break: break-all;
      font-size: 14px;
      color: #666;
    }
    .warning {
      color: #DC2626;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>🔐 Reset hasła - Tracker Kasy</h2>
    
    <p>Witaj!</p>
    
    <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w aplikacji <strong>Tracker Kasy</strong>.</p>
    
    <p>Kliknij poniższy przycisk, aby ustawić nowe hasło:</p>
    
    <p style="text-align: center;">
      <a href="${resetUrl}" class="button">Zresetuj hasło</a>
    </p>
    
    <p>Lub skopiuj i wklej poniższy link do przeglądarki:</p>
    
    <div class="link-box">${resetUrl}</div>
    
    <p class="warning">⏰ Link ważny przez 1 godzinę.</p>
    
    <p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość. Twoje konto pozostanie bezpieczne.</p>
    
    <div class="footer">
      <p>Tracker Kasy - Twoje finanse pod kontrolą</p>
      <p>Ta wiadomość została wygenerowana automatycznie. Prosimy nie odpowiadać.</p>
    </div>
  </div>
</body>
</html>
    `;

    const info: SentMessageInfo = await this.transporter.sendMail({
      from: '"Tracker Kasy" <noreply@trackerkasy.com>',
      to: email,
      subject: 'Reset hasła - Tracker Kasy',
      html: htmlTemplate,
    });

    // W trybie development, pokaż link do podglądu emaila w Ethereal
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n📬 Password Reset Email Sent!`);
      console.log(`   To: ${email}`);
      console.log(`   Preview: ${previewUrl}`);
      console.log(`   Reset URL: ${resetUrl}\n`);
    }
  }
}
