const { db } = require('../db.js');
// POST /signup
const signup = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = 'user'; // default to non-admin

  if (!name || !email || !password) {
    return res.status(400).send('Please provide name, email, and password');
  }

  const query = `
    INSERT INTO user (NAME, EMAIL, ROLE, PASSWORD)
    VALUES ('${name}', '${email}', '${role}', '${password}')
  `;


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

  const query = `
    INSERT INTO USER (NAME, EMAIL, ROLE, PASSWORD)
VALUES ('${name}', '${email}', '${role}', '${password}')
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
