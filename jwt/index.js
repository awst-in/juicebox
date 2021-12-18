const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 3, username: 'joshua' }, 'server secret', { expiresIn: '1w' });

// token;

const recoveredData = jwt.verify(token, 'server secret');

recoveredData;

jwt.verify(token, 'server secret');

module.exports = {
  token,
};
