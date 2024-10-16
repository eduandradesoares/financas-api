const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: {
    type: Number,
    required: true,
    get: v => (v / 100).toFixed(2),
    set: v => v * 100
  },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  transactionType: {
    type: String,
    enum: ['avista', 'parcelada', 'fixa'],
    required: true
  },
  totalInstallments: {
    type: Number,
    required: function () { return this.transactionType === 'parcelada'; }
  },
  currentInstallment: {
    type: Number,
    required: function () { return this.transactionType === 'parcelada'; }
  },
  frequency: {
    type: String,
    enum: ['week', 'month', 'year'],
    required: function () { return this.transactionType === 'fixa'; }
  }
}, {
  toJSON: { getters: true, virtuals: false },
  toObject: { getters: true, virtuals: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);