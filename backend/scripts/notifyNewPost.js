#!/usr/bin/env node

/**
 * Script to send email notifications for new blog posts
 * Usage: node scripts/notifyNewPost.js <post-slug> <post-title> <post-excerpt> [post-date] [post-category] [post-read-time]
 */

const fetch = require('node-fetch');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function notifyNewPost() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Usage: node scripts/notifyNewPost.js <post-slug> <post-title> <post-excerpt> [post-date] [post-category] [post-read-time]');
    console.error('Example: node scripts/notifyNewPost.js "ai-future" "The Future of AI in Africa" "Exploring how artificial intelligence will transform African industries..." "2024-01-15" "Technology" "5 min read"');
    process.exit(1);
  }

  const [slug, title, excerpt, date, category, readTime] = args;
  
  const postData = {
    slug: slug,
    title: title,
    excerpt: excerpt,
    date: date || new Date().toISOString().split('T')[0],
    category: category || 'General',
    readTime: readTime || '5 min read'
  };

  console.log('📧 Sending email notifications for new post...');
  console.log('Post data:', postData);

  try {
    const response = await fetch(`${BACKEND_URL}/api/email/notify-new-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postData })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Email notifications sent successfully!');
      console.log(`📊 Total recipients: ${result.data.total}`);
      console.log(`✅ Successful sends: ${result.data.sent}`);
      console.log(`❌ Failed sends: ${result.data.failed}`);
      console.log(`🆔 Notification ID: ${result.data.notification_id}`);
    } else {
      console.error('❌ Failed to send notifications:', result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error sending notifications:', error.message);
    process.exit(1);
  }
}

// Run the script
notifyNewPost();
