<template>

  <div class="error-container">
    <div class="animation-container">
      <p class="error-animation">Oops!</p>
    </div>
    <h1 class="error-title">404 Stránka nenalezena</h1>
    <p>Tato stránka neexistuje, prosím zkontrolujte adresu</p>
    <router-link id="NotFoundText" :to="{ name: 'Home' }">Zpět domů</router-link>


  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  message?: string;
}>();
</script>

<style scoped>
.error-container {
  text-align: center;
  padding: 20px;
}

.error-title {
  font-size: 3rem;
  color: #ff2700;
}

p {
  font-size: 1.2rem;
  margin: 10px 0;
}

router-link {
  color: #4169e1;
  text-decoration: underline;
  cursor: pointer;
}

.animation-container {
  margin-top: 20px;
}

.error-animation {
  font-size: 2rem;
  font-weight: bold;
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
