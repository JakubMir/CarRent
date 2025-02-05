<script setup lang="ts">

</script>

<template>
  <v-card variant="elevated" elevation="10" class="text-center fill-height">
    <v-card-title class="text-h5 font-weight-bold text-wrap">
      <slot name="cardTitle"/>
    </v-card-title>
    <v-card-text class="text-body-1">
      <slot name="cardText"/>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
