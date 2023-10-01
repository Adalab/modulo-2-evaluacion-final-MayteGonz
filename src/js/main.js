'use strict';
const inputSearch = document.querySelector('.js-search');
const btnSearch = document.querySelector('.btn-search');
const sectionSearch = document.querySelector('.js-sectionSearch');
const sectionFav = document.querySelector('.js-sectionFavorites');
const preShows = document.querySelector('.js-recomendedShows');
const btnclearFavs = document.querySelector('.js-btnClearFavs');

const url = 'https://api.tvmaze.com/search/shows?q=';
const url2 = 'https://api.tvmaze.com/search/shows?q=girls';

let showsFound = [];
let showsFavs = [];

const showsLS = JSON.parse(localStorage.getItem('shows'));
const showsFavsLS = JSON.parse(localStorage.getItem('showsFavs'));

function renderPreShows() {
  if (showsFavsLS !== null) {
    showsFavs = showsFavsLS;
    renderShowList(showsFavs, sectionFav, true);
  }

  if (showsLS !== null) {
    showsFound = showsLS;
    renderShowList(showsFound, sectionSearch, false);
  } else {
    fetch(url2)
      .then((response) => response.json())
      .then((dataShows) => {
        showsFound = dataShows;
        renderShowList(showsFound, sectionSearch, false);
        localStorage.setItem('shows', JSON.stringify(showsFound));
        preShows.innerHTML = 'Series recomendadas para tí';
      });
  }
}

function requestShows() {
  const searchValue = inputSearch.value;
  fetch(url + searchValue)
    .then((response) => response.json())
    .then((dataShows) => {
      if (dataShows.length === 0) {
        preShows.innerHTML = 'Prueba a buscar de nuevo =(';
        sectionSearch.innerHTML = '';
      } else {
        preShows.innerHTML = 'Esto es lo que hemos encontrado: ';
        showsFound = dataShows;
        renderShowList(showsFound, sectionSearch, false);
      }
      if (searchValue === '') {
        renderPreShows();
        preShows.innerHTML = '';
      }
    });
}
function renderOneShow(oneShow, isfavorite) {
  const cardShow = document.createElement('article');
  cardShow.classList.add('card');
  cardShow.classList.add('js-card');
  cardShow.setAttribute('id', oneShow.show.id);
  const topCard = document.createElement('div');

  if (!isfavorite) {
    if (
      showsFavs.findIndex(
        (findFavourite) => findFavourite.show.id === oneShow.show.id
      ) !== -1
    ) {
      cardShow.classList.add('favorite');
    }
  }

  const titleShow = document.createElement('h3');
  titleShow.classList.add('titleShow');
  titleShow.textContent = oneShow.show.name;
  const imgShow = document.createElement('img');
  imgShow.alt = `Imagen de portada de la peli ${oneShow.show.name}`;

  if (oneShow.show.image) {
    imgShow.src = oneShow.show.image.medium;
  } else {
    imgShow.src = './assets/images/placeholderShow.jpg';
  }

  imgShow.classList.add('imgShow');

  topCard.appendChild(titleShow);

  if (isfavorite) {
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btnDelete');
    btnDelete.textContent = 'X';
    topCard.appendChild(btnDelete);
    topCard.classList.add('topCard');
  }

  //ver si one Show está en el array de favoritos, por su ID. Si lo está le añades la clase favorite.

  cardShow.appendChild(topCard);
  cardShow.appendChild(imgShow);
  return cardShow;
}

function renderShowList(listShows, section, isfavorite) {
  section.innerHTML = '';
  for (const show of listShows) {
    section.appendChild(renderOneShow(show, isfavorite));
  }
  addEventCardShow();
}

function handleClickSearch(event) {
  event.preventDefault();
  requestShows();
}

function handleClickShow(event) {
  const idShowClicked = parseInt(event.currentTarget.id);

  let clickedShow = showsFound.find((item) => item.show.id === idShowClicked);

  const indexFav = showsFavs.findIndex(
    (item) => item.show.id === idShowClicked
  );

  if (indexFav === -1) {
    showsFavs.push(clickedShow);
  } else {
    showsFavs.splice(indexFav, 1);
  }

  renderShowList(showsFavs, sectionFav, true);
  renderShowList(showsFound, sectionSearch, false);
  localStorage.setItem('showsFavs', JSON.stringify(showsFavs));
}

function handleClickClear() {
  showsFavs = [];
  localStorage.removeItem('showsFavs');
  renderShowList(showsFavs, sectionFav, true);
  renderShowList(showsFound, sectionSearch, false);
}
function addEventCardShow() {
  const allShows = document.querySelectorAll('.js-card');

  for (const item of allShows) {
    item.addEventListener('click', handleClickShow);
  }
}

btnSearch.addEventListener('click', handleClickSearch);
renderPreShows();
btnclearFavs.addEventListener('click', handleClickClear);
