require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
const sha256 = require('sha256');

const User = mongoose.model('User', { name: String, password: String });
const Message = mongoose.model('Message', { text: String, author: { type: mongoose.ObjectId, ref: 'User' } });

const WebSocket = require('ws'); // подключаем библиотеку ws

const wss = new WebSocket.Server({ port: 1313 }); // создаем экземпляр сервера на порту 1313

wss.on('connection', (mySuperWSServer) => { // при установлении соединения
  // mySuperWSServer.send('welcome'); // ??

  mySuperWSServer.on('message', async (message) => { // при получении сообщения от юзера
    // console.log(message);
    const messageJson = JSON.parse(message); // пришла строка, сделали из нее json
    const messageAuthor = await User.findOne({ name: messageJson.author }); // нашли автора письма
    // console.log(messageAuthor);
    const dbMessage = new Message({ text: messageJson.message, author: messageAuthor._id }); // записали сообщение в бд
    await dbMessage.save();
    wss.clients.forEach((client) => { // перебираем массив всех подключенных клиентов и каждому отсылаем сообщение, которое пришло на 18 строке
      client.send(message);
    });
  });
});

router.get('/chat', async (req, res) => {
  const messages = await Message.find().populate('author'); // находим в бд все сообщения
  // console.log(messages);
  if (req.session?.username) { // рендерим страницу чата только если юзер есть в сессии
    return res.render('chat', { messages });
  }
  res.redirect('/users/signin');
});

router.get('/gif', (req, res) => {
  
  res.render('gif');
});

router.get('/search', (req, res) => {
  res.render('search');
});

router.post('/search', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ name: username });
  let myCounter = Number(req.cookies.searchCount); 
  if (myCounter) {
    myCounter += 1;
    res.cookie('searchCount', myCounter); 
  } else {
    myCounter = 1;
    res.cookie('searchCount', myCounter, { 'Max-Age': 86400000 });
  }
  res.render('profile', { user });
});

router.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render('profile', { user });
});

router.route('/signup')
  .get((req, res) => {
    res.render('signup');
  })

  .post(async (req, res) => {
    const { name, password } = req.body;
    const securePass = sha256(password);
    const user = new User({ name, password: securePass });
    await user.save();
    req.session.username = name;
    res.redirect(`/users/profile/${user._id}`);
  });

router.route('/signin')
  .get((req, res) => {
    res.render('signin');
  })

  .post(async (req, res) => {
    // console.log(req.session);
    if ((new Date().getTime() - Number(req.session?.time)) < 1) {
      return res.send('уходи');
    }
    req.session.time = new Date().getTime();
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (user) {
      if (sha256(password) === user.password) { 
        req.session.username = name;
      } else {
        return res.send('неправильно введен пароль');
      }
    } else {
      return res.send('направильно введено имя');
    }
    res.redirect(`/users/profile/${user._id}`);
  });

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
