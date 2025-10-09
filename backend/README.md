# Tropical Perspective - Email Subscription Backend

A comprehensive backend system for handling email subscriptions and notifications for the Tropical Perspective blog.

## Features

- ✅ Email subscription management
- ✅ Welcome emails for new subscribers
- ✅ New post notification system
- ✅ Unsubscribe functionality
- ✅ Admin panel for managing subscriptions
- ✅ SQLite database for data persistence
- ✅ Rate limiting and security features
- ✅ Beautiful HTML email templates

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your email configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=noreply@tropicalperspective.com
```

### 3. Gmail Setup (for development)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this App Password in your `.env` file

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Email Subscription

- `POST /api/email/subscribe` - Subscribe to newsletter
- `GET /api/email/unsubscribe/:token` - Unsubscribe from newsletter
- `GET /api/email/stats` - Get subscription statistics
- `GET /api/email/subscribers` - List all subscribers
- `POST /api/email/notify-new-post` - Send new post notifications
- `GET /api/email/test-connection` - Test email service connection

### Health Check

- `GET /api/health` - Server health check

## Admin Tools

### Interactive Admin Panel

```bash
node scripts/adminPanel.js
```

### Command Line Tools

```bash
# View subscription statistics
node scripts/adminPanel.js stats

# List all subscribers
node scripts/adminPanel.js list

# Test email connection
node scripts/adminPanel.js test-email
```

### Send New Post Notifications

```bash
node scripts/notifyNewPost.js "post-slug" "Post Title" "Post excerpt..." "2024-01-15" "Technology" "5 min read"
```

## Database Schema

The system uses SQLite with three main tables:

### email_subscriptions
- `id` - Primary key
- `email` - Subscriber email (unique)
- `name` - Subscriber name (optional)
- `subscribed_at` - Subscription timestamp
- `is_active` - Subscription status
- `unsubscribe_token` - Unique token for unsubscribing
- `preferences` - JSON preferences
- `last_notified` - Last notification timestamp

### notifications
- `id` - Primary key
- `post_slug` - Blog post slug
- `post_title` - Blog post title
- `post_excerpt` - Blog post excerpt
- `sent_at` - Notification timestamp
- `total_recipients` - Number of recipients
- `successful_sends` - Successful email sends
- `failed_sends` - Failed email sends

### notification_logs
- `id` - Primary key
- `notification_id` - Reference to notifications table
- `subscriber_id` - Reference to email_subscriptions table
- `email` - Recipient email
- `status` - Send status (sent/failed)
- `error_message` - Error details if failed

## Email Templates

The system includes beautiful HTML email templates for:

- **Welcome Email**: Sent when users subscribe
- **New Post Notification**: Sent when new posts are published

Templates are responsive and include:
- Branded header with logo
- Professional styling
- Unsubscribe links
- Mobile-friendly design

## Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- Helmet.js for security headers
- Input validation with express-validator
- CORS configuration
- SQL injection protection
- Environment variable protection

## Production Deployment

### Environment Variables

For production, update your `.env` file:

```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Use a production SMTP service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### Recommended SMTP Services

- **SendGrid** - Reliable and feature-rich
- **Mailgun** - Developer-friendly
- **AWS SES** - Cost-effective for high volume
- **Postmark** - Great deliverability

### Database Backup

The SQLite database is stored in `database/subscriptions.db`. For production:

1. Set up regular backups
2. Consider migrating to PostgreSQL for better scalability
3. Monitor database size and performance

## Monitoring

### Health Check

Monitor the API health:

```bash
curl http://localhost:5000/api/health
```

### Logs

The server logs important events:
- ✅ Successful email sends
- ❌ Failed email sends
- 📊 Database operations
- 🔒 Security events

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check email credentials in `.env`
   - Verify SMTP settings
   - Test connection: `node scripts/adminPanel.js test-email`

2. **CORS errors**
   - Update `FRONTEND_URL` in `.env`
   - Restart the server

3. **Database errors**
   - Check file permissions
   - Ensure database directory exists
   - Restart the server to reinitialize

### Debug Mode

Set `NODE_ENV=development` for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
