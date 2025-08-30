const { Transaction, User } = require('../models');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['timestamp', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionsByUserId = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.params.userId },
      order: [['timestamp', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransactionsByUserId
};