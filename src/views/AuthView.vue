<template>
<div class="form-signin" v-if="logged === false" > 
  <form method="POST" @submit.prevent="submitForm">
    <img class="mb-3" :src="require('@/assets/icon.png')" alt="Mistral" style="width: 60px; height: 60px;">
    <h1 class="h3 mb-3 fw-normal" v-if="register === true">Sign Up</h1>
    <h1 class="h3 mb-3 fw-normal" v-else>Authenticate</h1>
    <p class="text-danger">{{ response.message }}</p>
    <div class="form-floating mb-3" v-if="register === true">
      <input v-model="form.name" type="text" class="form-control bg-dark text-light" placeholder="John Doe" :disabled="bussy" required />
      <label for="floatingInput">Your name</label>
    </div>
    <div class="form-floating">
      <input v-model="form.email" type="email" class="form-control bg-dark text-light" placeholder="email@example.com" :disabled="bussy" required />
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating mb-3">
      <input v-model="form.password" type="password" class="form-control  bg-dark text-light" placeholder="***********" :disabled="bussy" required />
      <label for="floatingPassword">Password</label>
    </div>
    <button class="w-100 btn btn-lg btn-outline-secondary text-light" type="submit" :disabled="bussy">
      <span v-if="register === true">Sign up</span>
      <span v-else>Sign in</span>
    </button>
    <p class="text-start" v-if="register === true"> 
      Already have a user? <a href="#" class="text-light" @click.prevent="register = false">Login</a>
    </p>
    <p class="text-start" v-else> 
      No user? <a href="#" class="text-light" @click.prevent="register = true">Register</a>
    </p>
  </form>
</div>
<div v-else>
  <h1>Manage your movies and shows</h1>
  <p class="lead">Saved movies or shows are saved in your account.</p>
  <div><a class="link-secondary me-1" href="#" @click="logout">Log out</a> <i class="fa-duotone fa-arrow-right-from-bracket"></i></div>
    <TabView class="tabview-custom dark-panel" ref="tabview4" >
        <TabPanel>
            <template #header>
                <i class="fa-duotone fa-clapperboard-play me-2"></i>
                <span>Movies</span>
            </template>
            <DataTable :value="movies" responsiveLayout="scroll" :paginator="true" :rows="10" sortMode="multiple" :lazy="true">
              <Column header="IMG" style="width: 50px">
                  <template #body="slotProps">
                      <img class="img" style="width: 30px; height: auto;" :src="`https://www.themoviedb.org/t/p/w220_and_h330_face${slotProps.data.movie.poster_path}`" @error="imgerror" :alt="slotProps.data.movie.title" />
                  </template>
              </Column>
              <Column header="Movie Title" style="max-width: 250px">
                  <template #body="slotProps">
                      <div class="w-100">
                        <div>{{ slotProps.data.movie.title }}</div>
                        <div class="text-muted text-truncate">{{ slotProps.data.movie.overview }}</div>
                      </div>
                  </template>
              </Column>
              <Column header="Rating" style="width: 60px" field="rating" :sortable="true">
                  <template #body="slotProps">
                      <span>{{ slotProps.data.rating === 0 ? 'N/A' : slotProps.data.rating }}</span>
                  </template>
              </Column>
              <Column header="IMDB" style="width: 50px" field="movie.vote_average" :sortable="true">
                  <template #body="slotProps">
                      <span>{{ slotProps.data.movie.vote_average }}</span>
                  </template>
              </Column>
              <Column header="Release Date" style="width: 150px">
                  <template #body="slotProps">
                      <span>{{ slotProps.data.movie.release_date }}</span>
                  </template>
              </Column>
              
              <template #footer>
                  <span v-if="movies">
                    In total, there {{ movies.length === 1? 'is one movie': `are ${movies.length} movies` }}.
                  </span>
              </template>
              <template #empty>
                    <div class="text-center w-100 my-5">You haven't added any movies yet.</div>
              </template>
            </DataTable>
        </TabPanel>
        <TabPanel>
            <template #header>
                <i class="fa-duotone fa-popcorn me-2"></i>
                <span>TV Shows</span>
            </template>
            <DataTable :value="shows" responsiveLayout="scroll" :paginator="true" :rows="10" sortMode="multiple" :lazy="true">
              <Column header="IMG" style="width: 50px">
                  <template #body="slotProps">
                      <img class="img" style="width: 30px; height: auto;" :src="`https://www.themoviedb.org/t/p/w220_and_h330_face${slotProps.data.movie.poster_path}`" @error="imgerror" :alt="slotProps.data.movie.title" />
                  </template>
              </Column>
              <Column header="Show Title" style="max-width: 250px">
                  <template #body="slotProps">
                      <div class="w-100">
                        <div>{{ slotProps.data.movie.title }}</div>
                        <div class="text-muted text-truncate">{{ slotProps.data.movie.overview }}</div>
                      </div>
                  </template>
              </Column>
              <Column header="Rating" style="width: 60px" field="rating" :sortable="true">
                  <template #body="slotProps">
                      <span>{{ slotProps.data.rating === 0 ? 'N/A' : slotProps.data.rating }}</span>
                  </template>
              </Column>
              <Column header="IMDB" style="width: 50px" field="movie.vote_average" :sortable="true">
                  <template #body="slotProps">
                      <span>{{ slotProps.data.movie.vote_average }}</span>
                  </template>
              </Column>
              <Column header="Release Date" style="width: 150px">
                  <template #body="slotProps">
                      <span>{{ slotProps.data.movie.release_date }}</span>
                  </template>
              </Column>
              
              <template #footer>
                  <span v-if="shows">
                    In total, there {{ shows.length === 1? 'is one show': `are ${shows.length} shows` }}.
                  </span>
              </template>
              <template #empty>
                  <div class="text-center w-100 my-5">You haven't added any shows yet.</div>
              </template>
            </DataTable>
        </TabPanel>
    </TabView>
  </div>
</template>

<script>
import { onMounted, computed, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  components: {
    TabPanel,
    TabView,
    DataTable,
    Column
  },
  setup () {
    const store = useStore();
    const user = computed(() => store.state.user);
    const logged = computed(() => store.state.logged);
    const bussy = computed(() => store.state.bussy);
    const loading = computed(() => store.state.loading);

    const movies = computed(() => logged.value === true ? store.getters.user.movies : []);
    const shows = computed(() => logged.value === true ? store.getters.user.shows : []);

    const register = ref(false);
    const response = ref({
      success: false,
      message: '',
    });
    const imgerror = (e) => {
      const noimage = require('@/assets/noimg.png');
      e.target.src = noimage;
    }
    const form = reactive({
      email: '',
      password: '',
      name: '',
    });
    const logout = () => {
      store.dispatch('logout');
    };
    const submitForm = async () => {
      response.value = {
        success: false,
        message: '',
      };
      const { email, password, name } = form;
      if (register.value === true) {
        response.value = await store.dispatch('signup', { email, password, name });
      } else {
        response.value = await store.dispatch('login', { email, password });
      }
    }
    onMounted(() => {
      store.dispatch('setBussy', false);
    });
    return {
      imgerror,
      loading,
      movies,
      shows,
      logged,
      logout,
      response,
      form,
      submitForm,
      register,
      bussy,
      user
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep(.p-tabview .p-tabview-panels) {
    background: transparent;
    padding: 0 !important;
    border: 0 none;
    color: rgba(255, 255, 255, 0.87);
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
}
</style>