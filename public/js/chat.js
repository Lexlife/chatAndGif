const mesages = document.querySelector('#messages');
let adress = window.location.origin;
const newAdress = adress.replace('http', 'ws');
const wsocket = new WebSocket(`${newAdress}://${window.location.host}`);
// const wsocket = new WebSocket('ws://localhost:1313'); // создаем новое подключение к серверу по адресу 'ws://localhost:1313'
//локолхост переписать, 

wsocket.onopen = (something) => { // когда установлено соединение
  console.log(something, 'hello!');
};

wsocket.onmessage = (mess) => {
let myMessage = JSON.parse(mess.data); // получаем стркоу и преобразуем в json
  console.log(mess);
  const { author, message } = myMessage; // достаем нужные даные
  // const regEx = https:\/\/api\.giphy\.com\/v1\/gifs\/search\?q=;
  
  // if (message == regEx) {
  //   mesages.innerHTML += `
  //   <div>
  //   <strong>${author}: </strong>
  //   ${ message = `<img src="${message}">`}
  //   </div>
  //   `;
  // }
  // регулярка [gif] true massege  <img src="https://media1.giphy.com/media/3o6ZsZJQLk5G5iQ8Jq/giphy.gif">
  mesages.innerHTML += `
  <div>
  <strong>${author}: </strong>
  ${message}
  </div>
  `;
};

const { chatForm } = document.forms; // находим форму
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {}; // создае объект чтобы положить туда имя и текст
  data.message = chatForm.message.value;
  data.author = chatForm.username.value;
  wsocket.send(JSON.stringify(data)); // преобразуем объект с сообщением к строке потому что через вебсокет передаются только строки
  chatForm.message.value = ''; // очищаем инпут
});
