const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'subscriptions.db');

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('📊 Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const createSubscriptionsTable = `
      CREATE TABLE IF NOT EXISTS email_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        unsubscribe_token TEXT UNIQUE,
        preferences TEXT DEFAULT '{}',
        last_notified DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createNotificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_slug TEXT NOT NULL,
        post_title TEXT NOT NULL,
        post_excerpt TEXT,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_recipients INTEGER DEFAULT 0,
        successful_sends INTEGER DEFAULT 0,
        failed_sends INTEGER DEFAULT 0
      )
    `;

    const createNotificationLogsTable = `
      CREATE TABLE IF NOT EXISTS notification_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        notification_id INTEGER,
        subscriber_id INTEGER,
        email TEXT NOT NULL,
        status TEXT NOT NULL,
        error_message TEXT,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (notification_id) REFERENCES notifications (id),
        FOREIGN KEY (subscriber_id) REFERENCES email_subscriptions (id)
      )
    `;

    db.serialize(() => {
      db.run(createSubscriptionsTable, (err) => {
        if (err) {
          console.error('Error creating subscriptions table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Email subscriptions table created/verified');
      });

      db.run(createNotificationsTable, (err) => {
        if (err) {
          console.error('Error creating notifications table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Notifications table created/verified');
      });

      db.run(createNotificationLogsTable, (err) => {
        if (err) {
          console.error('Error creating notification logs table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Notification logs table created/verified');
        resolve();
      });
    });
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
          return;
        }
        console.log('📊 Database connection closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
};
