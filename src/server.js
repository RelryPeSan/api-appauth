const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const routes = require('./routes');
const port = process.env.PORT || 3000;

const server = express();

mongoose.connect('mongodb+srv://reratos:6ZShBlYoF5Nuzegv@clusterreactnative-1d2gr.mongodb.net/appauth?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

server.use(express.json());
server.use(cors());
server.use(routes);

server.listen(port, () => {
    console.log(`Server rodando na porta: ${port}`);
});