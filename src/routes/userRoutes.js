const express = require('express');
const router = new express.Router();
const { users } = require('../fakeDb/fakeDb');

router.get('/', (req, res) => {
    res.json({ users: users })
})

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === +req.params.id);
    res.json({ user });
})

module.exports = router;