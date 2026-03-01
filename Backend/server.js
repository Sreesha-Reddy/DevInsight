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

app.use(analyzeRoutes);

app.get('/', (req, res) => {
    res.send('Root');
})

app.listen(5500, () => {
    console.log('App is listening to port 5500');
});