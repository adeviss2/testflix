<template>
  <header class="mb-5">
    <div>
      <h3 class="float-md-start mb-0">
        <router-link to="/" class="text-light" style="text-decoration: none">
          <img :src="require('@/assets/testflix.png')" alt="Mistral" style="width: 100px; height: auto;">
        </router-link>
        <div class="position-relative d-inline ms-2">
          <div v-if="$route.name === 'TV Shows'" class="position-absolute" style="top: 0; left: 1px;">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-tv" width="36" height="36" viewBox="0 0 24 24" stroke-width="1" stroke="#d00000" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <polyline points="16 3 12 7 8 3" />
            </svg> 
          </div>
          <div v-if="$route.name === 'Home' || $route.name === 'Movies'" class="position-absolute" style="top: 0; left: 1px;">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-movie" width="36" height="36" viewBox="0 0 24 24" stroke-width="1" stroke="#d00000" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="8" y1="4" x2="8" y2="20" />
              <line x1="16" y1="4" x2="16" y2="20" />
              <line x1="4" y1="8" x2="8" y2="8" />
              <line x1="4" y1="16" x2="8" y2="16" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="16" y1="8" x2="20" y2="8" />
              <line x1="16" y1="16" x2="20" y2="16" />
            </svg>
          </div>
          <div v-if="$route.name === 'Auth'" class="position-absolute" style="top: 0; left: 1px;">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users" width="36" height="36" viewBox="0 0 24 24" stroke-width="1" stroke="#d00000" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
            </svg>
          </div>
        </div>
      </h3>
      <nav class="nav nav-masthead justify-content-center float-md-end">
        <router-link to="/movies" class="nav-link" title="Movies">Movies</router-link>
        <router-link to="/tv" class="nav-link" title="TV Shows">TV Shows</router-link>
        <router-link v-if="logged === true && 'user_metadata' in user" to="/auth" class="nav-link" :title="`${user.user_metadata.name}'s Dashboard`">
          {{ user.user_metadata.name }}
        </router-link>
        <router-link v-else to="/auth" class="nav-link" title="Sign In">Sign In</router-link>
        <a v-if="logged === true" href="/exit" @click.prevent="logout" class="nav-link" title="Log out">
          <span><i class="fa-duotone fa-arrow-right-from-bracket"></i></span>
        </a>
      </nav>
    </div>
  </header>
</template>
<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    setup () {
      const store = useStore();
      const user = computed(() => store.getters.user);
      const logged = computed(() => store.getters.logged);
      const logout = () => {
        store.dispatch('logout');
      };
        return {
          logout,
          logged,
          user
        }
    }
}
</script>