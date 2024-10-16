const Transaction = require('../models/transaction');

exports.createTransaction = async (req, res) => {
    try {
        const transactionData = req.body;

        // Arredonda o valor para duas casas decimais antes de salvar
        transactionData.amount = parseFloat(transactionData.amount).toFixed(2);

        const transaction = new Transaction(transactionData);
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (type && ['income', 'expense'].includes(type)) {
            query.type = type;
        }

        const transactions = await Transaction.find(query);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log('ID da transação:', id);
        console.log('Dados de atualização:', updateData);

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transação não encontrada" });
        }

        res.json(updatedTransaction);
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de transação inválido" });
        }
        res.status(500).json({
            message: "Erro ao atualizar a transação",
            error: error.message
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('ID da transação a ser excluída:', id);

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transação não encontrada" });
        }

        res.json({ message: "Transação excluída com sucesso", deletedTransaction });
    } catch (error) {
        console.error('Erro ao excluir transação:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de transação inválido" });
        }
        res.status(500).json({
            message: "Erro ao excluir a transação",
            error: error.message
        });
    }
};
