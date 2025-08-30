const express = require('express');
const { getTransactions, getTransactionsByUserId } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', getTransactions);
router.get('/user/:userId', getTransactionsByUserId);

module.exports = router;