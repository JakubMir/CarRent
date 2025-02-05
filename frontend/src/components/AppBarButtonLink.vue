<script setup lang="ts">

const { routeName } = defineProps({
  routeName: {
    type: String,
    required: true,
    default: ""
  }
})

</script>

<template>
  <v-btn variant="plain" :to="{ name: routeName }" :ripple="false" :draggable="false">
    <slot />
  </v-btn>
</template>

<style scoped>

</style>
