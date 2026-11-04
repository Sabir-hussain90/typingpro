import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Setup Transport using your .env credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationEmail(email: string, otp: string) {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border-top: 5px solid #6b4c9a; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #4a6a1f; margin-top: 0;">Welcome to TypingMaster!</h2>
        <p style="color: #333; line-height: 1.6; font-size: 16px;">Thank you for signing up. To complete your registration, please enter the following OTP (One-Time Password) on the activation page:</p>
        <div style="font-size: 36px; font-weight: bold; color: #6b4c9a; letter-spacing: 5px; text-align: center; padding: 15px; background: #eaffd0; border-radius: 5px; margin: 20px 0; border: 1px dashed #6b4c9a;">
          ${otp}
        </div>
        <p style="color: #333; line-height: 1.6; font-size: 16px;">This code is valid for <strong>15 minutes</strong>. If you didn't request this, please ignore this email.</p>
        <div style="font-size: 12px; color: #888; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          &copy; 2026 TypingMaster Pro. All rights reserved.
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"TypingMaster" <noreply@typingmaster.com>',
        to: email,
        subject: 'Activate your TypingMaster Account',
        html,
      });
      console.log(`Activation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw new InternalServerErrorException('Failed to send activation email');
    }
  }

  async sendPasswordResetEmail(email: string, otp: string) {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; border-top: 5px solid #6b4c9a; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #4a6a1f; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #333; line-height: 1.6; font-size: 16px;">We received a request to reset your password. Please enter the following OTP on the reset password page:</p>
        <div style="font-size: 36px; font-weight: bold; color: #6b4c9a; letter-spacing: 5px; text-align: center; padding: 15px; background: #eaffd0; border-radius: 5px; margin: 20px 0; border: 1px dashed #6b4c9a;">
          ${otp}
        </div>
        <p style="color: #333; line-height: 1.6; font-size: 16px;">This code is valid for <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
        <div style="font-size: 12px; color: #888; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
          &copy; 2026 TypingMaster Pro. All rights reserved.
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"TypingMaster" <noreply@typingmaster.com>',
        to: email,
        subject: 'Reset your TypingMaster Password',
        html,
      });
      console.log(`Reset password email sent to ${email}`);
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw new InternalServerErrorException('Failed to send reset email');
    }
  }
}