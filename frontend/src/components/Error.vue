<template>
  <div class="error text-center" id="error-message">
    <v-row align="center" class="error-content">
        <v-col class="text-center align-center">
        <v-icon class="error-icon w-100" color="error" >mdi-alert-circle</v-icon>
        <h3 class="error-message">{{ message }}</h3>
        </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>()
</script>

<style scoped>
.error {
  border-radius: 8px;
  background-color: #f8d7da;
  padding: 1em 2em;
  color: #ff0015;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2em 0;
}

.error-content {
  display: flex;
  align-items: center;
}

.error-icon {
  font-size: 4em;
  margin-right: 1em;
}

.error-message {
  margin: 0;
  font-size: 1.2em;
}
</style>
