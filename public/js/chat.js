const mesages = document.querySelector('#messages');

const wsocket = new WebSocket('wss://chatgif.herokuapp.com/users/chat/'); // создаем новое подключение к серверу по адресу 'ws://localhost:1313'

wsocket.onopen = () => {
  wsocket.onmessage = (mess) => {
    let myMessage = JSON.parse(mess.data); // получаем строку и преобразуем в json
      console.log(mess);
      const { author, message } = myMessage; // достаем нужные даные
      // const regEx = https:\/\/api\.giphy\.com\/v1\/gifs\/search\?q=;
      
      // if (message === regEx) {
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
  
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {}; // создае объект чтобы положить туда имя и текст
      data.message = chatForm.message.value;
      data.author = chatForm.username.value;
      // wsocket.send(JSON.stringify(data)); // преобразуем объект с сообщением к строке потому что через вебсокет передаются только строки
    
      function isOpen(ws) { return ws.readyState === ws.OPEN }
    
      // if (!isOpen(wsocket)) return;
      wsocket.send(JSON.stringify(data));
    
      chatForm.message.value = ''; // очищаем инпут
    });
}

wsocket.onclose = () => {
  wsocket.close(1000, "Work complete");  
}
