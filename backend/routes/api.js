const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');


// Login (Mock)
// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
  
    if (!user) return res.status(404).json({ error: 'User not found' });
  
    // Direct string comparison (no hashing)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
  
    res.json({ role: user.role, username: user.username });
  });
  
  
// Admin only: Add item
router.post('/items', auth('admin'), async (req, res) => {
    const { name, category_id, quantity } = req.body;
    await db.query('INSERT INTO items(name, category_id, quantity) VALUES($1, $2, $3)', [name, category_id, quantity]);
    
  res.send('Item added');
});

// Admin: Create category
router.post('/categories', auth('admin'), async (req, res) => {
  const { name } = req.body;
  await db.query('INSERT INTO categories(name) VALUES($1)', [name]);
  res.send('Category added');
});

// Get all items
// Get all items with category name
router.get('/items', async (req, res) => {
    const { category_id } = req.query;
    const baseQuery = `
      SELECT items.*, categories.name AS category_name
      FROM items
      JOIN categories ON items.category_id = categories.id
      ${category_id ? 'WHERE items.category_id = $1' : ''}
    `;
  
    const items = category_id
      ? await db.query(baseQuery, [category_id])
      : await db.query(baseQuery);
  
    res.json(items.rows);
  });
  
// Get all categories
router.get('/categories', async (req, res) => {
  const categories = await db.query('SELECT * FROM categories');
  res.json(categories.rows);
});

// Employee: Request item
// Employee: Request item
router.post('/requests', auth('employee'), async (req, res) => {
    const { item_id, username, quantity } = req.body;
    await db.query(
      'INSERT INTO requests(item_id, username, quantity) VALUES($1, $2, $3)',
      [item_id, username, quantity]
    );
    res.send('Request placed');
  });
  

// Admin: View requests
// Admin: View requests
router.get('/requests', auth('admin'), async (req, res) => {
    const data = await db.query(
      `SELECT r.id, i.name AS item, r.username, r.quantity
       FROM requests r
       JOIN items i ON r.item_id = i.id`
    );
    res.json(data.rows);
  });
  

module.exports = router;
