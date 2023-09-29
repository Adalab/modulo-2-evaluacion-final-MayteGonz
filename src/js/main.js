'use strict';
const inputSearch = document.querySelector('.js-search');
const btnSearch = document.querySelector('.btn-search');
const sectionSearch = document.querySelector('.js-sectionSearch');
const sectionFav = document.querySelector('.js-sectionFavorites');
const error = document.querySelector('.js-error');
const url = 'https://api.tvmaze.com/search/shows?q=';

let moviesFound = [];
let moviesFavs = [];

function requestMovies() {
  const searchValue = inputSearch.value;
  fetch(url + searchValue)
    .then((response) => response.json())
    .then((dataMovies) => {
      if (dataMovies.length === 0) {
        error.innerHTML =
          'No podemos encontrar lo que has buscado =( Prueba con otra peli';
        sectionSearch.innerHTML = '';
      } else {
        error.innerHTML = '';
        moviesFound = dataMovies;
        renderMovieList(moviesFound, sectionSearch);
      }
    });
}
function renderOneMovie(oneMovie) {
  const cardMovie = document.createElement('article');
  cardMovie.classList.add('card');
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
}

function handleClickSearch(event) {
  event.preventDefault();
  requestMovies();
}

btnSearch.addEventListener('click', handleClickSearch);
