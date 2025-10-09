const { getDatabase } = require('../database/database');
const crypto = require('crypto');

class EmailSubscription {
  static async create(email, name = null) {
    const db = getDatabase();
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO email_subscriptions (email, name, unsubscribe_token)
        VALUES (?, ?, ?)
      `;
      
      db.run(sql, [email, name, unsubscribeToken], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            reject(new Error('Email already subscribed'));
            return;
          }
          reject(err);
          return;
        }
        
        // Fetch the created subscription
        EmailSubscription.findById(this.lastID)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM email_subscriptions WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  static async findByEmail(email) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM email_subscriptions WHERE email = ?';
      
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  static async findByUnsubscribeToken(token) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM email_subscriptions WHERE unsubscribe_token = ?';
      
      db.get(sql, [token], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  static async getAllActive() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM email_subscriptions WHERE is_active = 1 ORDER BY subscribed_at DESC';
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static async unsubscribe(token) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE email_subscriptions SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE unsubscribe_token = ?';
      
      db.run(sql, [token], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          reject(new Error('Invalid unsubscribe token'));
          return;
        }
        
        resolve({ success: true, message: 'Successfully unsubscribed' });
      });
    });
  }

  static async updateLastNotified(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE email_subscriptions SET last_notified = CURRENT_TIMESTAMP WHERE id = ?';
      
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  static async getStats() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_subscribers,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_subscribers,
          COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_subscribers,
          COUNT(CASE WHEN DATE(subscribed_at) = DATE('now') THEN 1 END) as new_today
        FROM email_subscriptions
      `;
      
      db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }
}

module.exports = EmailSubscription;
