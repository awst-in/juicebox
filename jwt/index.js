const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, username: 'albert' }, process.env.JWT_SECRET, { expiresIn: '1w' });

token;

const recoveredData = jwt.verify(token, process.env.JWT_SECRET);

recoveredData;

jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  token,
};
