const express = require('express');
const Item = require('../models/item');
const router = express.Router();
const { items } = require('../fakeDb/fakeDb'); // Import the items array from fakeDb.js
const ExpressError = require('../utils/expressError'); // Ensure you require ExpressError


// GET /items - List all items (http://localhost:3000/items)
router.get('', (req, res, next) => {
    try {
      return res.json({ items: Item.findAll() });
    } catch(err){
      return next(err)
    }
  });

// POST /items - Add a new item
router.post('', (req, res, next) => {
    try {
      let newItem = new Item(req.body.name, req.body.price);
      return res.json({item: newItem});
    } catch (err) {
      return next(err)
    }
  });

// GET /items/:name - Get a single item ( http://localhost:3000/items/milk)
router.get('/:name', (req, res, next) => {
    try {
      let foundItem = Item.find(req.params.name);
      return res.json({item:foundItem});
    } catch(err){
      return next(err)
    }
  });

// PATCH /items/:name - Update an item
router.patch('/:name', (req, res, next) => {
    try {
      let foundItem = Item.update(req.params.name, req.body);
      return res.json({ item: foundItem });
    } catch (err) {
      return next(err)
    }
  });

// DELETE /items/:name - Delete an item
router.delete('/:name', (req, res, next) => {
    try {
      Item.remove(req.params.name);
      return res.json({message:'Deleted'});
    } catch (err) {
      return next(err)
    }
  });

module.exports = router;