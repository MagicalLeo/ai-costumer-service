// utils/email.ts
import nodemailer from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

// 创建邮件发送者实例
export const createTransporter = async () => {
  // 从环境变量中获取 SMTP 配置
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  // 检查必要的配置
  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is missing. Please check your .env file');
  }

  // 创建 nodemailer transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return { transporter, from };
};

// 发送电子邮件的函数
export const sendEmail = async ({ to, subject, html, text }: EmailOptions) => {
  try {
    const { transporter, from } = await createTransporter();

    // 发送邮件
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // 简单地将 HTML 转为纯文本
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// 特定用于发送密码重置邮件的函数
export const sendPasswordResetEmail = async (
  to: string, 
  token: string, 
  username: string
) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/reset-password?token=${token}`;
  
  const subject = '重置您的密码';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="background-color: #4f46e5; padding: 20px; border-radius: 5px 5px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">密码重置</h1>
      </div>
      <div style="padding: 20px;">
        <p>亲爱的 ${username},</p>
        <p>我们收到了重置您帐户密码的请求。请点击下面的链接重置密码：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">重置我的密码</a>
        </div>
        <p>或者，您可以複製以下链接并粘贴到浏览器中：</p>
        <p style="word-break: break-all; color: #4f46e5;">${resetLink}</p>
        <p>请注意，此密码重置链接将在 1 小时后过期。</p>
        <p>如果您没有请求重置密码，请忽略此电子邮件或联繫我们的支援团队。</p>
        <p>谢谢,<br/>您的应用团队</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px;">
        <p>这是一封自动生成的电子邮件，请勿回復。</p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
};