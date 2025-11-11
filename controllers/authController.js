const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../db.js');

const signToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

const signUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = 'user';

  if (!email || !password) {
    return res.status(400).send('Please provide email, and password.');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error hashing password.');
    }

    const query = `INSERT INTO USER (EMAIL, ROLE, PASSWORD) VALUES (?, ?, ?)`;

    db.run(query, [email, role, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).send('Email already exists.');
        }
        console.error(err);
        return res.status(500).send('Database error.');
      }

    return res.status(200).send('Registration successful');
  });
