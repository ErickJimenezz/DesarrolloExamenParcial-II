
//obtiene la referencia al contenedor main
const main = document.querySelector(".main");

/* consigue el listado de generos */
fetch(
  genres_list_http +
  new URLSearchParams({
    api_key: api_key,
    language: 'es-ES',
  })
)
  .then((res) => res.json())
  .then((data) => {
    data.genres.forEach((item) => {
      fetchListaPeliculasPorGenero(item.id, item.name);
    });
  });

const fetchListaPeliculasPorGenero = (id, genres) => {
  fetch(
    movie_genres_http +
    new URLSearchParams({
      api_key: api_key,
      with_genres: id,
      language: 'es-ES',
      page: Math.floor(Math.random() * 3) + 1, //trae pagina al azar
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria(`${genres}_movies`, data.results);
    })
    .catch((err) => console.log(err));
};

/* crea el titulo de categoria */
const construirElementoCategoria = (category, data) => {

  main.innerHTML += `
    <div class="movie-list">
        <button class="pre-btn"> <img src="img/pre.png" alt=""></button>
          
          <h1 class="movie-category">${category.split("_").join(" ")}</h1>

          <div class="movie-container" id="${category}">
          </div>

        <button class="nxt-btn"> <img src="img/nxt.png" alt=""> </button>
    </div>
    `;


  construirTarjetas(category, data);
};

const construirTarjetas = (id, data) => {
  const movieContainer = document.getElementById(id);
  data.forEach((item, i) => {
    if (item.backdrop_path == null) {
      item.backdrop_path = item.poster_path;
      if (item.backdrop_path == null) {
        return;
      }
    }


    let title = item.title;
    if (title == null) {
      title = item.name;
    }

    movieContainer.innerHTML += `
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${title}</p>
        </div>
        `;

    if (i == data.length - 1) {
      setTimeout(() => {
        setupScrolling();
      }, 100);
    }
  });


};


function Buscando() {

  main.innerHTML = '  <header class="main">' +
    '<h1 class="heading">Pelis</h1>' +
    ' <p class="info">' +
    '  Las mejores pelis de la Red, series y cosas para quitar el tiempo,todo esta aqui</p>'
  '</header> ';


  Filtrado();

  search.value = '';
}

function Filtrado() {
  switch (filtro.value) {
    
    case "por nombre":
      filtrarPorNombre();
      break;

    case "género":
      filtrarPorGeneros();
      break;

    case "año":
      filtrarPoranio();
      break;

    case "Clasificacion R(+18),PG13,PG o G":
      filtrarPorClasificacion();
      break;

    case "Actualmente en Cine":
      filtrarActualPorCine();
      break;

    case "Peliculas para adultos mejor calificadas":
      filtrarPorClasificacionMayorVotadas();
      break;

    case "Series de televisión":
      filtrarSeries();
      break;
  }
}

function filtrarPorNombre() {
  let nombre = search.value;
  fetch(
    search_movies +
    new URLSearchParams({
      api_key: api_key,
      language: 'es-ES',
      query: nombre
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Filtro por nombre ' + nombre, data.results);
    })
    .catch((err) => console.log(err));
}

function filtrarPorGeneros() {
  let generos = search.value.split(',');
  fetch(
    genres_list_http +
    new URLSearchParams({
      api_key: api_key,
      language: 'es',
    })
  )
    .then((res) => res.json())
    .then((data) => {
      data.genres.forEach((item) => {
        console.log(item.name);
        if (generos.includes(item.name)) {
          fetchListaPeliculasPorGenero(item.id, item.name);
          console.log(item);
        }
      });
    });
}

function filtrarPoranio() {
  let anio = search.value;
  fetch(
    movie_genres_http +
    new URLSearchParams({
      api_key: api_key,
      primary_release_year: anio,
      language: 'es-ES',
      page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria(anio, data.results);
    })
    .catch((err) => console.log(err));
}

function filtrarPorClasificacion() {
  const clasificacion = search.value;
  fetch(
    movie_genres_http +
    new URLSearchParams({
      api_key: api_key,
      certification: clasificacion,
      language: 'es-ES',
      page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Clasificación ' + clasificacion, data.results);
      console.log(clasificacion)
    })
    .catch((err) => console.log(err));
}

function filtrarActualPorCine() {
  fetch(
    movie_now_playing +
    new URLSearchParams({
      api_key: api_key,
      language: 'es-ES',
      page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Actualmente en cine', data.results);
    })
    .catch((err) => console.log(err));
}

function filtrarPorClasificacionMayorVotadas() {

  fetch(
    movie_genres_http +
    new URLSearchParams({
      api_key: api_key,
      certification: 'R',
      language: 'es-ES',
      sort_by: 'vote_average.desc',
      page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Peliculas para adultos mejor calificadas', data.results);
    })
    .catch((err) => console.log(err));
}


function filtrarSeries() {
  fetch(
    series_tv +
    new URLSearchParams({
      api_key: api_key,
      language: 'es',
      page: Math.floor(Math.random() * 6) + 1, //trae pagina al azar
    })
  )
    .then((res) => res.json())
    .then((data) => {
      construirElementoCategoria('Series de TV', data.results);
    })
    .catch((err) => console.log(err));
}

