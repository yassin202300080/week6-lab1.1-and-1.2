const { db } = require('../db.js');

// POST /signup
const signUp = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = 'user'; // default to non-admin

  if (!name || !email || !password) {
    return res.status(400).send('Please provide name, email, and password');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error hashing password.');
    }
    const query = `
    INSERT INTO USER (NAME, EMAIL, ROLE, PASSWORD)
VALUES ('${name}', '${email}', '${role}', '${hashedPassword}')
  `;

  db.run(query, (err) => {
    if (err) {
      console.log(err.message);
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(400).send('Email already exists.');
      }
      return res.status(500).send('Database error.');
    }

    return res.status(200).send('Registration successful');
  });

    const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../db.js');

const signInToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password.');
  }

  const query = `SELECT * FROM USER WHERE EMAIL='${email}'`;

  db.get(query, (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }

const login = (req, res) => {
  db.get(query, (err, row) => {
    bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
      const token = signInToken(row.ID, row.ROLE);

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: row.ID,
          name: row.NAME,
          email: row.EMAIL,
          role: row.ROLE,
        },
        token,
      });
    });
  });
};


