#!/usr/bin/env node

/**
 * Admin panel script for managing email subscriptions
 * Usage: node scripts/adminPanel.js <command> [options]
 */

const fetch = require('node-fetch');
const readline = require('readline');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getStats() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/email/stats`);
    const result = await response.json();
    
    if (result.success) {
      console.log('\n📊 Email Subscription Statistics:');
      console.log('================================');
      console.log(`Total Subscribers: ${result.data.total_subscribers}`);
      console.log(`Active Subscribers: ${result.data.active_subscribers}`);
      console.log(`Inactive Subscribers: ${result.data.inactive_subscribers}`);
      console.log(`New Subscribers Today: ${result.data.new_today}`);
    } else {
      console.error('❌ Failed to fetch stats:', result.message);
    }
  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
  }
}

async function listSubscribers() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/email/subscribers`);
    const result = await response.json();
    
    if (result.success) {
      console.log('\n📧 Active Subscribers:');
      console.log('======================');
      
      if (result.data.length === 0) {
        console.log('No active subscribers found.');
        return;
      }
      
      result.data.forEach((subscriber, index) => {
        console.log(`${index + 1}. ${subscriber.email}${subscriber.name ? ` (${subscriber.name})` : ''}`);
        console.log(`   Subscribed: ${new Date(subscriber.subscribed_at).toLocaleDateString()}`);
        if (subscriber.last_notified) {
          console.log(`   Last notified: ${new Date(subscriber.last_notified).toLocaleDateString()}`);
        }
        console.log('');
      });
    } else {
      console.error('❌ Failed to fetch subscribers:', result.message);
    }
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error.message);
  }
}

async function sendTestNotification() {
  console.log('\n📧 Send Test Notification');
  console.log('========================');
  
  const slug = await question('Post slug: ');
  const title = await question('Post title: ');
  const excerpt = await question('Post excerpt: ');
  const date = await question('Post date (YYYY-MM-DD) [press Enter for today]: ') || new Date().toISOString().split('T')[0];
  const category = await question('Post category [press Enter for "General"]: ') || 'General';
  const readTime = await question('Read time [press Enter for "5 min read"]: ') || '5 min read';
  
  const postData = { slug, title, excerpt, date, category, readTime };
  
  console.log('\nSending notification...');
  
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
      console.log('✅ Test notification sent successfully!');
      console.log(`📊 Total recipients: ${result.data.total}`);
      console.log(`✅ Successful sends: ${result.data.sent}`);
      console.log(`❌ Failed sends: ${result.data.failed}`);
    } else {
      console.error('❌ Failed to send test notification:', result.message);
    }
  } catch (error) {
    console.error('❌ Error sending test notification:', error.message);
  }
}

async function testEmailConnection() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/email/test-connection`);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email service connection is working!');
    } else {
      console.error('❌ Email service connection failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing email connection:', error.message);
  }
}

async function showMenu() {
  console.log('\n🌴 Tropical Perspective - Email Admin Panel');
  console.log('==========================================');
  console.log('1. View subscription statistics');
  console.log('2. List all subscribers');
  console.log('3. Send test notification');
  console.log('4. Test email connection');
  console.log('5. Exit');
  
  const choice = await question('\nSelect an option (1-5): ');
  
  switch (choice) {
    case '1':
      await getStats();
      break;
    case '2':
      await listSubscribers();
      break;
    case '3':
      await sendTestNotification();
      break;
    case '4':
      await testEmailConnection();
      break;
    case '5':
      console.log('👋 Goodbye!');
      rl.close();
      return;
    default:
      console.log('❌ Invalid option. Please select 1-5.');
  }
  
  // Show menu again unless exiting
  if (choice !== '5') {
    await question('\nPress Enter to continue...');
    await showMenu();
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'stats':
    getStats().then(() => process.exit(0));
    break;
  case 'list':
    listSubscribers().then(() => process.exit(0));
    break;
  case 'test-email':
    testEmailConnection().then(() => process.exit(0));
    break;
  case 'interactive':
  default:
    showMenu();
    break;
}
