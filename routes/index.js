const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const authCheck = (req, res, next) => { 
  if (req.session.username) {
    next();
  } else {
    res.redirect('/users/signin');
  }
};

router.get('/', (req, res, next) => {
  // обращается к сайту каждые 29 минут
const https = require("https");
setTimeout(() => {
  https.get("https://chatgif.herokuapp.com");
}, 1000*60*29); // every 29 minutes
  res.render('index', { title: 'Giphy' });
});


module.exports = router;
