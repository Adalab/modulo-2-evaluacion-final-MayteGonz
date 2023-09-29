'use strict';
const inputSearch = document.querySelector('.js-search');
const btnSearch = document.querySelector('.btn-search');
const sectionSearch = document.querySelector('.js-sectionSearch');
const sectionFav = document.querySelector('.js-sectionFavorites');
const preMovies = document.querySelector('.js-recomendedMovies');
const url = 'https://api.tvmaze.com/search/shows?q=';
const url2 = 'https://api.tvmaze.com/search/shows?q=girls';

let moviesFound = [];
let moviesFavs = [];

const moviesLS = JSON.parse(localStorage.getItem('movies'));
const moviesFavsLS = JSON.parse(localStorage.getItem('moviesFavs'));

function renderPreMovies() {
  if (moviesFavsLS !== null) {
    moviesFavs = moviesFavsLS;
    renderMovieList(moviesFavs, sectionFav);
  }

  if (moviesLS !== null) {
    moviesFound = moviesLS;
    renderMovieList(moviesFound, sectionSearch);
  } else {
    fetch(url2)
      .then((response) => response.json())
      .then((dataMovies) => {
        moviesFound = dataMovies;
        renderMovieList(moviesFound, sectionSearch);
        localStorage.setItem('movies', JSON.stringify(moviesFound));
        preMovies.innerHTML = 'Algunas peliculas recomendadas para tí';
      });
  }
}

function requestMovies() {
  const searchValue = inputSearch.value;
  fetch(url + searchValue)
    .then((response) => response.json())
    .then((dataMovies) => {
      if (dataMovies.length === 0) {
        preMovies.innerHTML = 'Prueba a buscar de nuevo =(';
        sectionSearch.innerHTML = '';
      } else {
        preMovies.innerHTML = 'Esto es lo que hemos encontrado: ';
        moviesFound = dataMovies;
        renderMovieList(moviesFound, sectionSearch);
      }
      if (searchValue === '') {
        renderPreMovies();
        preMovies.innerHTML = '';
      }
    });
}
function renderOneMovie(oneMovie) {
  const cardMovie = document.createElement('article');
  cardMovie.classList.add('card');
  cardMovie.classList.add('js-card');
  // ver si oneMovie está en el array de favoritos, si está le pones clase del back diferente. mirar métodos array
  cardMovie.setAttribute('id', oneMovie.show.id);
  const titleMovie = document.createElement('h3');
  titleMovie.classList.add('titleMovie');
  titleMovie.textContent = oneMovie.show.name;
  const imgMovie = document.createElement('img');
  imgMovie.alt = `Imagen de portada de la peli ${oneMovie.show.name}`;

  if (oneMovie.show.image) {
    imgMovie.src = oneMovie.show.image.medium;
  } else {
    imgMovie.src = './assets/images/placeholderMovie.jpg';
  }

  imgMovie.classList.add('imgMovie');

  cardMovie.appendChild(titleMovie);
  cardMovie.appendChild(imgMovie);
  return cardMovie;
}

function renderMovieList(listMovies, section) {
  section.innerHTML = '';
  for (const movie of listMovies) {
    section.appendChild(renderOneMovie(movie));
  }
  addEventCardMovie();
}

function handleClickSearch(event) {
  event.preventDefault();
  requestMovies();
}

function handleClickMovie(event) {
  const idMovieClicked = parseInt(event.currentTarget.id);

  let clickedMovie = moviesFound.find(
    (item) => item.show.id === idMovieClicked
  );

  const indexFav = moviesFavs.findIndex(
    (item) => item.show.id === idMovieClicked
  );

  if (indexFav === -1) {
    moviesFavs.push(clickedMovie);
  } else {
    moviesFavs.splice(indexFav, 1);
  }
  renderMovieList(moviesFavs, sectionFav);
  // render de nuevo listado original moviesFound para poder ver la dierencia de background
  localStorage.setItem('moviesFavs', JSON.stringify(moviesFavs));
}

btnSearch.addEventListener('click', handleClickSearch);
renderPreMovies();

function addEventCardMovie() {
  const allMovies = document.querySelectorAll('.js-card');
  for (const item of allMovies) {
    item.addEventListener('click', handleClickMovie);
  }
}
