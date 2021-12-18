const express = require('express');
const server = express();
const morgan = require('morgan');
const { client } = require('./db');
client.connect();

//Middleware
server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
  console.log('<____Body Logger START____>');
  console.log(req.body);
  console.log('<_____Body Logger END_____>');

  next();
});

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { PORT = 3000 } = process.env;
server.listen(PORT, () => {
  console.log('The server is up on port', PORT);
  console.log(`View here: http://localhost:${PORT}`);
});
