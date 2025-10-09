const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For development, you can use Gmail or other SMTP services
    // For production, consider using services like SendGrid, Mailgun, or AWS SES
    
    if (process.env.NODE_ENV === 'development') {
      // Gmail configuration (for development)
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Use App Password for Gmail
        }
      });
    } else {
      // Production SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: `"Tropical Perspective" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Tropical Perspective Newsletter! 🌴',
      html: this.getWelcomeEmailTemplate(name),
      text: this.getWelcomeEmailText(name)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${email}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendNewPostNotification(subscribers, postData) {
    const results = [];
    
    for (const subscriber of subscribers) {
      const mailOptions = {
        from: `"Tropical Perspective" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: `New Post: ${postData.title} 🌴`,
        html: this.getNewPostEmailTemplate(postData, subscriber),
        text: this.getNewPostEmailText(postData, subscriber)
      };

      try {
        const result = await this.transporter.sendMail(mailOptions);
        console.log(`✅ New post notification sent to ${subscriber.email}`);
        results.push({ 
          success: true, 
          email: subscriber.email, 
          messageId: result.messageId 
        });
      } catch (error) {
        console.error(`❌ Failed to send notification to ${subscriber.email}:`, error);
        results.push({ 
          success: false, 
          email: subscriber.email, 
          error: error.message 
        });
      }
    }

    return results;
  }

  getWelcomeEmailTemplate(name) {
    const greeting = name ? `Hello ${name}!` : 'Hello!';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Tropical Perspective</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌴 TROPICAL PERSPECTIVE</div>
          <h1>Welcome to Our Community!</h1>
        </div>
        <div class="content">
          <h2>${greeting}</h2>
          <p>Thank you for subscribing to Tropical Perspective! We're excited to have you join our community of thinkers, innovators, and change-makers.</p>
          
          <p>You'll now receive:</p>
          <ul>
            <li>📚 Latest blog posts on African innovation and technology</li>
            <li>🧠 Insights on AI, entrepreneurship, and education</li>
            <li>🌍 Perspectives on climate change and sustainable solutions</li>
            <li>💡 Exclusive content and thought leadership</li>
          </ul>
          
          <p>Our mission is to inspire a new generation to craft Africa-centered solutions for the continent's toughest challenges.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Explore Our Blog</a>
          
          <p>If you have any questions or suggestions, feel free to reply to this email. We'd love to hear from you!</p>
          
          <p>Best regards,<br>
          The Tropical Perspective Team</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to Tropical Perspective newsletter.</p>
          <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribe_url}}">unsubscribe here</a>.</p>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeEmailText(name) {
    const greeting = name ? `Hello ${name}!` : 'Hello!';
    
    return `
${greeting}

Thank you for subscribing to Tropical Perspective! We're excited to have you join our community of thinkers, innovators, and change-makers.

You'll now receive:
- Latest blog posts on African innovation and technology
- Insights on AI, entrepreneurship, and education  
- Perspectives on climate change and sustainable solutions
- Exclusive content and thought leadership

Our mission is to inspire a new generation to craft Africa-centered solutions for the continent's toughest challenges.

Visit our blog: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

If you have any questions or suggestions, feel free to reply to this email. We'd love to hear from you!

Best regards,
The Tropical Perspective Team

---
You received this email because you subscribed to Tropical Perspective newsletter.
If you no longer wish to receive these emails, you can unsubscribe here: {{unsubscribe_url}}
    `;
  }

  getNewPostEmailTemplate(postData, subscriber) {
    const greeting = subscriber.name ? `Hello ${subscriber.name}!` : 'Hello!';
    const unsubscribeUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/email/unsubscribe/${subscriber.unsubscribe_token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Post: ${postData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .post-meta { color: #666; font-size: 14px; margin-bottom: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .excerpt { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌴 TROPICAL PERSPECTIVE</div>
          <h1>New Post Available!</h1>
        </div>
        <div class="content">
          <h2>${greeting}</h2>
          <p>We've just published a new post that we think you'll find interesting:</p>
          
          <h3>${postData.title}</h3>
          <div class="post-meta">
            📅 ${postData.date} | 📖 ${postData.readTime} | 🏷️ ${postData.category}
          </div>
          
          <div class="excerpt">
            <p>${postData.excerpt}</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/post/${postData.slug}" class="button">Read Full Post</a>
          
          <p>Thank you for being part of our community!</p>
          
          <p>Best regards,<br>
          The Tropical Perspective Team</p>
        </div>
        <div class="footer">
          <p>You received this email because you subscribed to Tropical Perspective newsletter.</p>
          <p>If you no longer wish to receive these emails, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.</p>
        </div>
      </body>
      </html>
    `;
  }

  getNewPostEmailText(postData, subscriber) {
    const greeting = subscriber.name ? `Hello ${subscriber.name}!` : 'Hello!';
    const unsubscribeUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/email/unsubscribe/${subscriber.unsubscribe_token}`;
    
    return `
${greeting}

We've just published a new post that we think you'll find interesting:

${postData.title}
Date: ${postData.date} | Read Time: ${postData.readTime} | Category: ${postData.category}

${postData.excerpt}

Read the full post: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/post/${postData.slug}

Thank you for being part of our community!

Best regards,
The Tropical Perspective Team

---
You received this email because you subscribed to Tropical Perspective newsletter.
If you no longer wish to receive these emails, you can unsubscribe here: ${unsubscribeUrl}
    `;
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
