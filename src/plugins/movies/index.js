import axios from "axios";
const apiKey = "62b689f3eb20197783b359d8d032da74";
const apiToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MmI2ODlmM2ViMjAxOTc3ODNiMzU5ZDhkMDMyZGE3NCIsInN1YiI6IjVmN2JhOTcxYzgxMTNkMDAzNTlmYTk5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hQk5Lgccy1qZbP5kKwEtzx3HtMmxVDp1MAI85toouvE";

axios.defaults.baseURL = "https://api.themoviedb.org/3/";
axios.defaults.headers.common["Authorization"] = `Bearer ${apiToken}`;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";

const Movie = {
    discoverMovie: async (filters, page) => {
        const res = await axios.get(`/discover/movie?${filters}&region=US&page=${page}&sort_by=vote_average.desc`);
        const results = await res.data.results;
        return results;
    },
    discoverShow: async (filters, page) => {
        const res = await axios.get(`/discover/tv?${filters}&region=US&page=${page}&sort_by=vote_average.desc`);
        const results = await res.data.results;
        return results;
    },
    queryMovie: async (query, page) => {
        // trim query
        query = query.trim();
        const res = await axios.get(`/search/movie?query=${query}&region=US&page=${page}`);
        const results = await res.data.results;
        return results;
    },
    queryShow: async (query, page) => {
        // trim query
        query = query.trim();
        const res = await axios.get(`/search/tv?query=${query}&region=US&page=${page}`);
        const results = await res.data.results;
        return results;
    },
    getMovies: async (filter, page) => {
        const res = await axios.get(`movie/${filter}?region=US&page=${page}`);
        return res.data;
    },
    getShows: async (filter, page) => {
        const res = await axios.get(`tv/${filter}?region=US&page=${page}`);
        return res.data;
    },
}

export default Movie;
