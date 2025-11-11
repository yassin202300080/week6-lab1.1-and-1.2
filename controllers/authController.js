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

      const token = signToken(this.lastID, role);
      return res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        token,
      });
    });
  });
};

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password.');
  }

  const query = `SELECT * FROM USER WHERE EMAIL = ?`;

  db.get(query, [email], (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }

    if (!row) {
      return res.status(401).send('Invalid credentials');
    }

    bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error verifying password.');
      }

      if (!isMatch) {
        return res.status(401).send('Invalid credentials');
      }

      const token = signToken(row.ID, row.ROLE);

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: row.ID,
          email: row.EMAIL,
          role: row.ROLE,
        },
        token,
      });
    });
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send('Access denied: Token missing or malformed');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access denied: Admins only');
    }
    next();
  });
};

module.exports = { signUp, login, verifyToken, verifyAdmin };
