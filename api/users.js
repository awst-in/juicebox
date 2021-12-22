const express = require('express');
const { token, jwt } = require('../jwt');
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, createUser, getUserById, updateUser } = require('../db');
const { requireUser } = require('./utils');

usersRouter.use((req, res, next) => {
  console.log('A request is being made to /users');

  next();
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users,
  });
});

usersRouter.get('/:userId', async (req, res, next) => {
  try {
    const userId = await getUserById(userId);
    res.send({
      userId,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password',
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      res.send({ message: "you're logged in!", token });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists',
      });
    }

    const user = await createUser({
      username,
      password,
      name,
      location,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1w',
      }
    );

    res.send({
      message: 'thank you for signing up',
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
  try {
    const userId = await getUserById(req.params.userId);

    if (userId === req.user.id) {
      const updatedUserId = await updateUser(userId.id, { active: false });
      res.send({ userId: updatedUserId });
    } else {
      next(
        userId
          ? {
              name: 'UnauthorizedUserError',
              message: 'You cannot delete a user which is not you',
            }
          : {
              name: 'UserNotFoundError',
              message: 'That user does not exist',
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
