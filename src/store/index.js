import { createStore } from 'vuex'
import Movie from '@/plugins/movies';
import createPersistedState from "vuex-persistedstate";
import Sb from '@/plugins/supabase';
export default createStore({
  state: {
    user: null,
    session: null,
    logged: false,
    theme: 'dark',
    bussy: true,
    loading: false,
    movies: [],
    shows: [],
    favorites: [],
    movieFilters: 'top_rated',
    showFilters: 'top_rated',
  },
  getters: {
    user(state) {
      return state.user;
    },
    session(state) {
      return state.session;
    },
    logged(state) {
      return state.logged;
    },
    theme(state) {
      return state.theme
    },
    loading(state) {
      return state.loading;
    },
    bussy(state) {
      return state.bussy
    },
    movies(state) {
      return state.movies
    },
    shows(state) {
      return state.shows
    },
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    clearUser(state) {
      state.user = null;
      state.session = null;
      state.logged = false;
    },
    setTheme(state, theme) {
      state.theme = theme
    },
    setBussy(state, bussy) {
      state.bussy = bussy
    },
    setMovies(state, movies) {
      state.movies = movies
    },
    setShows(state, shows) {
      state.shows = shows
    },
    setMovieFilter(state, filter) {
      state.movieFilters = filter
    },
    setShowFilter(state, filter) {
      state.showFilters = filter
    },
    setSession(state, session) {
      state.user = session.user;
      delete session.user;
      state.session = session;
      state.logged = true;
    },
    setUserMoviesAndShows(state, payload) {
      if (payload.type === 'movies') {
        state.user.movies = payload.movies;
      }
      if (payload.type === 'shows') {
        state.user.shows = payload.movies;
      }
    },
  },
  actions: {
    getUserMoviesAndShows({ commit }) {
      commit('setLoading', true);
      return new Promise((resolve) => {
        Sb.get('movies').then(response => {
          commit('setUserMoviesAndShows', {
            movies: response.data,
            type: 'movies'
          });
        });
        Sb.get('shows').then(response => {
          commit('setUserMoviesAndShows', {
            movies: response.data,
            type: 'shows'
          });
        });
        commit('setLoading', false);
      });
    },
    rateMovie({ state, commit, dispatch }, { table, movie, rating }) {
      commit('setLoading', true);
      return new Promise((resolve) => {
        Sb.get(table, movie.id)
          .then(res => {
            if(res.data.length === 0) {
              Sb.insert(table, {
                user_id: state.user.id,
                movie,
                movie_id: movie.id,
                rating,
              }).then(res => {
                resolve(res);
                dispatch('getUserMoviesAndShows');
              })
            } else {
              const id = res.data[0].id;
              Sb.update(table, {
                movie_id: movie.id,
                rating,
              }).then(res => {
                resolve(res);
                dispatch('getUserMoviesAndShows');
              })
            }
          });
        
      });
    },
    favoriteMovie({ state, commit, dispatch }, { table, movie }) {
      commit('setLoading', true);
      return new Promise((resolve) => {
        Sb.get(table, movie.id)
          .then(res => {
            if(res.data.length === 0) {
              Sb.insert(table, {
                user_id: state.user.id,
                movie,
                movie_id: movie.id,
                is_favorite: true,
              }).then(res => {
                resolve(res);
                dispatch('getUserMoviesAndShows');
              })
            } else {
              Sb.update(table, {
                movie_id: movie.id,
                is_favorite: true,
              }).then(res => {
                resolve(res);
                dispatch('getUserMoviesAndShows');
              })
            }
          });
        
      });
    },
    fetchDialogContent({ commit }, { table, id }) {
      commit('setLoading', true);
      return new Promise((resolve) => {
        Sb.get(table, id).then(res => {
          if(res.success === true) {
            resolve(res.data[0]);
          } else {
            resolve(null);
          }
          commit('setLoading', false);
        });
      })
      
    },
    setSession({ commit }, session) {
      commit('setSession', session)
    },
    login({ commit }, data) {
      return new Promise((resolve) => {
        const { email, password } = data;
        commit('setBussy', true);
        Sb.login(email, password).then((resp) => {
          resolve(resp);
          commit('setBussy', false);
        })
      })
      
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('setBussy', true);
        Sb.logout().then((resp) => {
          commit('clearUser');
          resolve(resp);
          commit('setBussy', false);
        })
      })
      
    },
    signup({ commit }, data) {
      return new Promise((resolve) => {
        const { email, password, name } = data;
        commit('setBussy', true);
        Sb.signup(email, password, name).then((resp) => {
          resolve(resp);
          commit('setBussy', false);
        })
      })
    },
    setMovieFilter({ commit }, filter, page = 1) {
      commit('setBussy', true);
      commit('setMovieFilter', filter);
      setTimeout(() => {
        Movie.getMovies(filter, page).then(({ results }) => {
          commit('setMovies', results)
        }).finally(() => {
          commit('setBussy', false);
        });
      }, 500)
    },
    setShowFilter({ commit }, filter, page = 1) {
      commit('setBussy', true);
      commit('setShowFilter', filter);

      setTimeout(() => {
        Movie.getShows(filter, page).then(({ results }) => {
          commit('setShows', results)
        }).finally(() => {
          commit('setBussy', false);
        });
      }, 500);
    },
    start({ state, commit }, page = 1) {
      commit('setBussy', true);
      Movie.getMovies(state.movieFilters, page).then(({ results }) => {
        commit('setMovies', results)
      });
      Movie.getShows(state.showFilters, page).then(({ results }) => {
        commit('setShows', results)
      });
      commit('setBussy', false);
    },
    setTheme({ commit }, theme) {
      commit('setTheme', theme)
    },
    setBussy({ commit }, bussy) {
      commit('setBussy', bussy)
    }
  },
  plugins: [createPersistedState({
    key: 'vuex',
    reducer (val) {
      if(val.user === null) {
        return {}
      }
      return val
    }
  })],
})
