const APIKEY = 'uKYzGineAq95iQKftc3azoZNNa1Q5qJ4';

  document.querySelector('#btnSearch').addEventListener('click', ev => {
    ev.preventDefault();
    let str = document.getElementById("search").value.trim();
    let url = `https://api.giphy.com/v1/gifs/search?q=${str}&api_key=${APIKEY}&limit=1g=`;
    url = url.concat(str);
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(content => {
        console.log('data', content.data);
        console.log('meta', content.meta); {
          let fig = document.createElement('figure');
          let img = document.createElement('img');
          let fc = document.createElement('figcaption');
          img.src = content.data[0].images.downsized.url;
          img.alt = content.data[0].title;
          fc.textContent = content.data[0].title;
          fig.appendChild(img);
          fig.appendChild(fc);
          let out = document.querySelector('.out');
          out.insertAdjacentElement('afterbegin', fig);
          document.querySelector('#search').value = '';
        }
      })
      .catch(err => {
        console.error(err);
      })
  });

