const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão MongoDB aprimorada
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Conectado ao MongoDB com sucesso!');
    console.log('Nome do banco de dados:', mongoose.connection.name);
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    console.log('String de conexão utilizada:', process.env.MONGODB_URI);
    // Tenta reconectar após 5 segundos
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Rotas
app.use('/api/transactions', require('./routes/transactionRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));