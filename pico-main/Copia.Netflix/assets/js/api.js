    const API_KEY = 'c667bb5e646014215a60d63255243d3a';
    const BASE_URL = 'https://api.themoviedb.org/3';

    async function fetchMovies(category = 'popular') {
        const url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.results;
    }

    async function fetchGenres(_category = 'Tendencias') {
        const url = `${BASE_URL}/genre/${movie}/list?api_key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.genres;
    }

    async function fetchMovieDetails(movieId) {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }
