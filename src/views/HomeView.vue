<template>
  <div class="home">
    <h1>Search and rate movies</h1>
    <p class="lead">You can search, rate or add a movie to your favorites.</p>
    <div class="lead m-auto mb-5" style="max-width: 500px">
      <div class="mb-3">
        <span class="p-input-icon-left p-input-icon-right w-100">
            <i class="pi pi-search" />
            <i class="pi pi-spin pi-spinner" :class="{'visible': bussy, 'invisible': !bussy}" />
            <i class="pi pi-times" v-if="query.length && !bussy" @click="query = ''; mainPageNo = 1; start()"/>
            <InputText type="text" class="p-inputtext-lg w-100"  placeholder="Search for a movie.." v-model="query"/>
        </span>
        <div class="text-end small text-muted mt-1" v-text="noresf"></div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 text-start">
        <ul class="nav mfilters">
          <li class="nav-item">
            <a class="nav-link fw-bold text-muted" :class="{ 'active': mfilter === 'top_rated'}" href="#" @click.prevent="$store.dispatch('setMovieFilter', 'top_rated')">
              Top rated movies
              <i class="fa-solid fa-star text-warning  ms-1"></i>
              </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-bold text-muted" :class="{ 'active': mfilter === 'popular'}" href="#" @click.prevent="$store.dispatch('setMovieFilter', 'popular')">
              Popular movies
              <i class="fa-solid fa-star text-warning  ms-1"></i>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-bold text-muted" :class="{ 'active': mfilter === 'now_playing'}" href="#" @click.prevent="$store.dispatch('setMovieFilter', 'now_playing')">
              In theathers now
              <i class="fa-solid fa-star text-warning  ms-1"></i>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-bold text-muted" :class="{ 'active': mfilter === 'upcoming'}" href="#" @click.prevent="$store.dispatch('setMovieFilter', 'upcoming')">
              Upcoming movies
              <i class="fa-solid fa-star text-warning  ms-1"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col col-sm-12 col-md-4 col-lg-3" v-for="(movie, key) in movies" :key="key">
        <a class="movie" style="text-decoration: none; color: unset;" 
          @click.prevent="dialog = true; dialogContent = movie; fetchDialogContent(movie)" 
          href="#" 
          @mouseover="mouseover(movie.id, movie.backdrop_path)" 
          @mouseleave="mouseover(movie.id, movie.poster_path)"
        >
          <div class="card bg-dark text-white mb-1">
            <img :id="movie.id" :src="`https://www.themoviedb.org/t/p/w220_and_h330_face${movie.poster_path}`" @error="imgerror" class="card-img poster" :alt="movie.title">
          </div>
          <div class="card bg-secondary mb-5 subcard">
            <div class="card-body">
              <div class="text-truncate"><strong>{{ movie.title }}</strong></div>
              <div class="row">
                <div class="col col-4 small text-light opacity-50">
                  <strong class="me-3">{{ new Date(movie.release_date).getFullYear() }}</strong>
                </div>
                <div class="col col-8 text-warning small text-end">
                  <div class="d-inline" v-html="rating(movie.vote_average)"></div>
                  <div class="d-inline ms-2">({{ movie.vote_average }})</div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <a v-if="query.length" href="#" style="text-decoration: none; color: unset;" @click="nextPageQuery">load more..</a>
        <a v-else href="#" style="text-decoration: none; color: unset;" @click="nextPage">load more..</a>
      </div>
    </div>
  </div>

  <Dialog @show="toggleBody('hidden')" @hide="toggleBody('auto')" v-model:visible="dialog" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '60vw'}" :modal="true" :draggable="false">
    <template #header v-if="dialogContent !== null">
      <h4>{{ dialogContent.title }} ({{ new Date(dialogContent.release_date).getFullYear() }})</h4>
    </template>
    <div class="card mb-3 shadow-none bg-dark" style="width: 100%; border: none;">
      <div class="row g-0">
        <div class="col-md-4 p-0 m-0">
          <img :src="`https://www.themoviedb.org/t/p/w220_and_h330_face${dialogContent.poster_path}`" @error="imgerror" class="img-fluid rounded-start w-100" :alt="dialogContent.title">
        </div>
        <div class="col-md-8 text-start">
          <div class="card-body">
            <h5 class="card-title">{{ dialogContent.title }} ({{ new Date(dialogContent.release_date).getFullYear() }})</h5>
            <p class="card-text">
              {{ dialogContent.overview }}
            </p>
            <div class="small text-start mb-3">
              <div class="d-inline me-3"><strong>IMDB</strong></div>
              <div class="d-inline text-warning " v-html="rating(dialogContent.vote_average)"></div>
              <div class="d-inline ms-2 text-warning ">({{ dialogContent.vote_average }})</div>
              <div class="d-inline ms-2">{{ dialogContent.vote_count }} votes</div>
            </div>
            <div class="text-start" v-if="logged === true">
              <div class="d-inline me-3"><strong>Yours</strong></div>
              <div class="d-inline text-warning">
                <Rating :modelValue="userMovieRating" :stars="10" :cancel="false" @change="e => rateMovie(e, dialogContent)" />
              </div>
              <div class="d-inline ms-2 text-warning fs-5">({{ userMovieRating }})</div>
            </div>
            <p class="card-text" v-if="logged === false">
              <small class="text-danger">
                You need to be logged in order to save your rating or add title to favorites.
              </small>
            </p>
            
            <div class="card-text mt-5" v-if="dialogContent.extra && logged === true">
              <Button v-if="dialogContent.extra.is_favorite === true" :disabled="true" class="p-button-sm p-button-success" type="button" label="Added to Favorite" icon="pi pi-heart" :loading="loading" />
              <Button v-else class="p-button-sm p-button-success" type="button" label="Add to Favorite" icon="pi pi-heart" @click="e => favoriteMovie(e, dialogContent)" :loading="loading" />
            </div>
            <div class="card-text mt-5" v-else>
              <Button :disabled="logged === false" class="p-button-sm" type="button" label="Add to Favorite" icon="pi pi-heart" @click="e => favoriteMovie(e, dialogContent)" :loading="loading" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Movie from '@/plugins/movies';
import InputText from 'primevue/inputtext';
import Helper from '@/plugins/helpers';
// import {
//   mouseover,

// } from '@/plugins/helpers';

import { useStore } from 'vuex';


export default {
  name: 'HomeView',
  components: {
    Button, Rating, Dialog, InputText
  },
  setup() {
    const store = useStore();
    // Vue computed properties
    const logged = computed(() => store.getters.logged);
    const bussy = computed(() => store.state.bussy);
    const loading = computed(() => store.state.loading);
    const topMovies = computed(() => store.state.movies);
    const mfilter = computed(() => store.state.movieFilters);
    // Vue reactive properties
    const query = ref('');
    const dialog = ref(false);
    const dialogContent = ref(null);
    const selected = ref('');
    const mainPageNo = ref(1);
    const queryPageNo = ref(1);
    const userMovieRating = ref(0);
    const movies = ref([]);
    const filteredMovies = ref([]);

    // Custom functions
    const toggleBody = (state) => {
      document.body.style.overflow = state;
    };
    const rateMovie = (ev, mov) => {
      store.dispatch('rateMovie', {
        table: 'movies',
        movie: mov,
        rating: ev.value
      }).then(res => {
        if(res.success === true) {
          fetchDialogContent(mov);
        }
      });
    };
    const favoriteMovie = (ev, mov) => {
      store.dispatch('favoriteMovie', {
        table: 'movies',
        movie: mov,
      }).then(res => {
        if(res.success === true) {
          fetchDialogContent(mov);
        }
      });
    };
    const filtered = computed(() => {
      return data.filter(item => item.toString().toLowerCase().indexOf(query.value.toLowerCase()) >= 0);
    });
    const searchMovie = async (event) => {
      store.dispatch('setBussy', true);
      const search = await Movie.queryMovie(query.value);
        setTimeout(() => {
            if (!event.query.trim().length) {
                filteredMovies.value = [...search];
            }
            else {
                filteredMovies.value = search.filter((movie) => {
                    return movie.title.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            store.dispatch('setBussy', false);
        }, 100);
    };

    const mouseover = (id, poster) => {
        const elem = document.getElementById(id);
        elem.src = `https://www.themoviedb.org/t/p/w220_and_h330_face${poster}`;
    };
    const rating = (rating) => {
      rating = (rating / 2).toFixed(2);
      let output = [];
      for (var i = rating; i >= 1; i--) {
        output.push('<i class="fa-solid fa-star"></i>&nbsp;');
      }
      if (i > 0 && i < 1) {
        output.push('<i class="fa-regular fa-star-half-stroke"></i>&nbsp;');
      }
      for (let i = (5 - rating); i >= 1; i--) {
        output.push('<i class="fa-regular fa-star"></i>&nbsp;');
      }
      return output.join('');
    };

    const imgerror = (e) => {
      const noimage = require('@/assets/noimg.png');
      e.target.src = noimage;
    };

    let delay;
    const noresf = ref('');
    const nextPageQuery = async () => {
      queryPageNo.value++;
      const customFilter = Helper.sfilter(query.value);
      store.dispatch('setBussy', true);
      let movieresults;

      if(customFilter !== null) {
          movieresults = await Movie.discoverMovie(customFilter, queryPageNo.value);
        } else {
          movieresults = await Movie.queryMovie(query.value, queryPageNo.value);
        }
      
      if(movieresults.length > 0) {
        movieresults = movieresults.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
        movies.value = movieresults;
      }
      store.dispatch('setBussy', false);
    };
    const search = (query) => {
      clearTimeout(delay);
      delay = setTimeout(async () => {
        const customFilter = Helper.sfilter(query)
        queryPageNo.value = 1;
        store.dispatch('setBussy', true);
        let movieresults;
        if(customFilter !== null) {
          movieresults = await Movie.discoverMovie(customFilter, queryPageNo.value);
        } else {
          movieresults = await Movie.queryMovie(query, queryPageNo.value);
        }
        
        if(movieresults.length > 0) {
          movieresults = movieresults.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
          movies.value = movieresults;
        } else {
          noresf.value = 'No results found';
        }
        
        store.dispatch('setBussy', false);
      }, 1000);
    };
    const start = () => {
      queryPageNo.value = 1;
      store.dispatch('start', mainPageNo.value);
    };

    const nextPage = () => {
      mainPageNo.value++;
      store.dispatch('start', mainPageNo.value);
    };
    
    const fetchDialogContent = (mmv) => {
      if(logged.value === true) {
        store.dispatch('fetchDialogContent', {
          table: 'movies',
          id: mmv.id
        }).then(res => {
          if(res !== undefined) {
            userMovieRating.value = res.rating;
            dialogContent.value.extra = res;
          }
        });
      }
    };
    /// VUE Functions
    onMounted(() => {
      if(topMovies.value.length === 0) {
        start();
      } else {
        movies.value = topMovies.value;
        store.dispatch('setBussy', false);
      }
    });

    watch(dialog, (opened) => {
      if(!opened) {
        dialogContent.value = null;
        userMovieRating.value = 0;
      }
    });
    
    watch(topMovies, (mov) => {
      movies.value = mov;
    });
    
    watch(query, (q) => {
      noresf.value = '';
      if(q && q.length > 2) {
        search(q);
      }
    });

    // VUE Returns
    return {
      loading,
      toggleBody,
      favoriteMovie,
      logged,
      rateMovie,
      userMovieRating,
      nextPageQuery,
      nextPage,
      start,
      bussy,
      filteredMovies,
      searchMovie,
      dialogContent,
      fetchDialogContent,
      dialog,
      rating,
      mouseover,
      movies,
      filtered,
      selected,
      query,
      imgerror,
      mfilter,
      noresf,
    }
  }
}
</script>
