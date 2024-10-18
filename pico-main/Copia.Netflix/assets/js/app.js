document.addEventListener('DOMContentLoaded', () => {
    loadPage().catch(error => console.error('Error al cargar la página:', error));
});

async function loadPage() {
    const loadingTasks = [
        { task: loadBanner, errorMessage: 'Error al cargar el banner' },
        { task: () => loadMovies('trending', 'trending-carousel'), errorMessage: 'Error al cargar películas en tendencia' },
        { task: () => loadMovies('popular', 'popular-carousel'), errorMessage: 'Error al cargar películas populares' },
        { task: loadMyList, errorMessage: 'Error al cargar mi lista' }
    ];

    await Promise.allSettled(loadingTasks.map(async ({ task, errorMessage }) => {
        try {
            await task();
        } catch (error) {
            console.error(errorMessage, error);
        }
    }));
}

async function loadBanner() {
    const movies = await fetchMovies('popular');
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    const bannerElements = {
        title: document.getElementById('banner-title'),
        description: document.getElementById('banner-description'),
        image: document.getElementById('banner-image')
    };

    if (!randomMovie || !bannerElements.title || !bannerElements.description || !bannerElements.image) {
        throw new Error('Missing banner elements or movie data');
    }

    bannerElements.title.textContent = randomMovie.title;
    bannerElements.description.textContent = randomMovie.overview;
    bannerElements.image.src = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
    bannerElements.image.alt = randomMovie.title;
}

async function loadMovies(category, carouselId) {
    const movies = await fetchMovies(category);
    const carousel = document.getElementById(carouselId);
    
    if (!carousel) {
        throw new Error(`Carousel element not found: ${carouselId}`);
    }

    const fragment = document.createDocumentFragment();
    movies.slice(0, 10).forEach(movie => {
        const img = createMovieImage(movie);
        fragment.appendChild(img);
    });

    carousel.innerHTML = '';
    carousel.appendChild(fragment);
}

function createMovieImage(movie) {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = movie.title;
    img.loading = 'lazy';
    img.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}`;
    });
    return img;
}

async function loadMyList() {
    // Implementar lógica para cargar la lista personalizada del usuario
    // Por ejemplo:
    // const userList = await fetchUserList();
    // renderUserList(userList);
}

async function fetchMovies(category) {
    const API_KEY = 'your_api_key_here'; // Asegúrate de no exponer tu clave API real en el código del cliente
    const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=es-ES`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching ${category} movies:`, error);
        return [];
    }
}