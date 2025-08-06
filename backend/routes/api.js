const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
require('dotenv').config();


router.get('/', (req, res) => {
  res.send('Inventory backend is running.');
});


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
    const { item_id, username, quantity,action } = req.body;
    await db.query(
      'INSERT INTO requests(item_id, username, quantity,action) VALUES($1, $2, $3, $4)',
      [item_id, username, quantity,action]
    );
    res.send('Request placed');
  });
  

// Admin: View requests
// Admin: View requests
router.get('/requests', auth('admin'), async (req, res) => {
  let query = `
    SELECT r.id, i.name AS item, r.username, r.quantity, r.action, i.category_id, r.status
    FROM requests r
    JOIN items i ON r.item_id = i.id
  `;

  const { category_id } = req.query;
  if (category_id) {
    query += ` WHERE i.category_id = ${category_id}`;
  }

  query += ' ORDER BY r.id DESC';

  const { rows } = await db.query(query);
  res.json(rows);
});


// PATCH /items/:id — Update quantity (admin only)
router.patch('/items/:id', auth('admin'), async (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.id;

  try {
    await db.query('UPDATE items SET quantity = $1 WHERE id = $2', [quantity, itemId]);
    res.send('Item quantity updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating item');
  }
});

// DELETE /items/:id — Delete item (admin only)
router.delete('/items/:id', auth('admin'), async (req, res) => {
  const itemId = req.params.id;

  try {
    await db.query('DELETE FROM items WHERE id = $1', [itemId]);
    res.send('Item deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting item');
  }
});

// PATCH /requests/:id/complete
router.patch('/requests/:id/complete', auth('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      'UPDATE requests SET status = $1 WHERE id = $2',
      ['completed', id]
    );
    res.send('Request marked as completed');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating request status');
  }
});

router.post('/stock-updates', auth('employee'), async (req, res) => {
  const { item_id, requested_quantity, username } = req.body;

  try {
    await db.query(
      'INSERT INTO stock_update_requests (item_id, requested_quantity, username) VALUES ($1, $2, $3)',
      [item_id, requested_quantity, username]
    );
    res.send('Stock update request submitted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting stock update request');
  }
});



  

module.exports = router;
