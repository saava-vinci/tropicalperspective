const express = require('express');
const { body, validationResult } = require('express-validator');
const EmailSubscription = require('../models/EmailSubscription');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation middleware
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
];

// Subscribe to newsletter
router.post('/subscribe', validateEmail, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name } = req.body;

    // Check if email is already subscribed
    const existingSubscription = await EmailSubscription.findByEmail(email);
    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return res.status(409).json({
          success: false,
          message: 'Email is already subscribed to the newsletter'
        });
      } else {
        // Reactivate existing subscription
        const db = require('../database/database').getDatabase();
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE email_subscriptions SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
            [email],
            function(err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
        
        // Send welcome email
        await emailService.sendWelcomeEmail(email, name);
        
        return res.json({
          success: true,
          message: 'Successfully resubscribed to the newsletter!'
        });
      }
    }

    // Create new subscription
    const subscription = await EmailSubscription.create(email, name);
    
    // Send welcome email
    await emailService.sendWelcomeEmail(email, name);
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: {
        id: subscription.id,
        email: subscription.email,
        subscribed_at: subscription.subscribed_at
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Unsubscribe from newsletter
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const result = await EmailSubscription.unsubscribe(token);
    
    // Return HTML page for better user experience
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Tropical Perspective</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>🌴 Tropical Perspective</h1>
        <div class="success">
          <h2>Successfully Unsubscribed</h2>
          <p>You have been successfully unsubscribed from our newsletter. We're sorry to see you go!</p>
          <p>If you change your mind, you can always subscribe again from our website.</p>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Visit Our Blog</a>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - Tropical Perspective</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { background: #f8d7da; color: #721c24; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>🌴 Tropical Perspective</h1>
        <div class="error">
          <h2>Invalid Unsubscribe Link</h2>
          <p>The unsubscribe link is invalid or has already been used.</p>
          <p>If you continue to receive emails, please contact us directly.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Get subscription stats (admin endpoint)
router.get('/stats', async (req, res) => {
  try {
    const stats = await EmailSubscription.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all subscribers (admin endpoint)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await EmailSubscription.getAllActive();
    res.json({
      success: true,
      data: subscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        name: sub.name,
        subscribed_at: sub.subscribed_at,
        last_notified: sub.last_notified
      }))
    });
  } catch (error) {
    console.error('Subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Send notification for new post (admin endpoint)
router.post('/notify-new-post', async (req, res) => {
  try {
    const { postData } = req.body;
    
    // Validate post data
    if (!postData || !postData.slug || !postData.title || !postData.excerpt) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post data. Required: slug, title, excerpt'
      });
    }

    // Get all active subscribers
    const subscribers = await EmailSubscription.getAllActive();
    
    if (subscribers.length === 0) {
      return res.json({
        success: true,
        message: 'No active subscribers to notify',
        data: { total: 0, sent: 0, failed: 0 }
      });
    }

    // Send notifications
    const results = await emailService.sendNewPostNotification(subscribers, postData);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    // Log notification in database
    const db = require('../database/database').getDatabase();
    const notificationId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO notifications (post_slug, post_title, post_excerpt, total_recipients, successful_sends, failed_sends)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [postData.slug, postData.title, postData.excerpt, subscribers.length, successful, failed],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // Log individual results
    for (const result of results) {
      const subscriber = subscribers.find(s => s.email === result.email);
      db.run(
        `INSERT INTO notification_logs (notification_id, subscriber_id, email, status, error_message)
         VALUES (?, ?, ?, ?, ?)`,
        [
          notificationId,
          subscriber.id,
          result.email,
          result.success ? 'sent' : 'failed',
          result.error || null
        ]
      );
    }

    // Update last_notified for successful sends
    for (const result of results) {
      if (result.success) {
        const subscriber = subscribers.find(s => s.email === result.email);
        await EmailSubscription.updateLastNotified(subscriber.id);
      }
    }

    res.json({
      success: true,
      message: `Notification sent to ${successful} subscribers`,
      data: {
        total: subscribers.length,
        sent: successful,
        failed: failed,
        notification_id: notificationId
      }
    });

  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Test email service connection
router.get('/test-connection', async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();
    res.json({
      success: isConnected,
      message: isConnected ? 'Email service is connected' : 'Email service connection failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: error.message
    });
  }
});

module.exports = router;
