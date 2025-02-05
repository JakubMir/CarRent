<template>
  <v-app>
    <v-main>
      <AppBar/>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from "@/components/AppBar.vue";
import { onMounted } from 'vue';
import {useNotificationService} from "@/composables/useNotificationService";

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user") ?? 'false');

  if (user && user.user_id) {
    console.log("Automatically registering user to socket.");
    const { registerSocket } = useNotificationService();
    registerSocket();
  }
});
</script>
