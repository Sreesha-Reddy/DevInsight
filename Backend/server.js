require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');

require('./config/db');
const analyzeRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: 'ok' });
})

app.use(analyzeRoutes);

app.get('/', (req, res) => {
    res.send('Root');
})

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});