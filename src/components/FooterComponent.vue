<template>
<footer class="mt-auto text-white-50">
    <div class="mt-5 mb-2">
        <router-link to="/" class="text-light d-block" style="text-decoration: none">
          <img :src="require('@/assets/testflix.png')" alt="Mistral" style="width: 100px; height: auto;">
        </router-link>
        <code class="me-1">&copy;{{ new Date().getFullYear() }}</code> &bull; 
        <code class="me-1">TESTFLIX</code> &bull; 
        <code class="me-1">Moraru Alin</code>
    </div>
</footer>
</template>
