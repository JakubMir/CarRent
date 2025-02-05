<template>
  <div class="lds-dual-ring"></div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 400px;
  height: 400px;
  position: relative;
  animation: lds-scale 2s infinite ease-in-out;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 400px;
  height: 400px;
  margin: 12px;
  border-radius: 50%;
  border: 30px solid transparent;
  border-top-color: #F39F20;
  border-right-color: #F39F20;
  border-bottom-color: #EBBB1E;
  border-left-color: #EBBB1E;
  animation: lds-dual-ring 1s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes lds-scale {
  0%, 100% {
    transform: scale(0.6);
  }
  50% {
    transform: scale(1);
  }
}

@media (max-width: 600px) {
  .lds-dual-ring {
    width: 100px;
    height: 100px;
  }

  .lds-dual-ring:after {
    width: 100px;
    height: 100px;
    border-width: 10px;
  }
}
</style>
