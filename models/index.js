const User = require('./User');
const Transaction = require('./Transaction');

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Transaction,
};