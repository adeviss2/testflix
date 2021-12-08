<template>
  <HeaderComponent/>
  <main class="px-3">
    <router-view />
  </main>
  <FooterComponent/>
  <PageSpinner :show="$store.state.bussy" />
</template>

<script>
import { onBeforeMount } from 'vue';
import HeaderComponent from '@/components/HeaderComponent';
import FooterComponent from '@/components/FooterComponent';
import PageSpinner from '@/components/PageSpinner';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent,
    PageSpinner,
  },

  setup() {
    const store = useStore();
    onBeforeMount(() => {
      store.dispatch('setBussy', true);
    })
  },
}
</script>
