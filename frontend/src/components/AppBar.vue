
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {useAuthService} from "@/composables/useAuthService";
import { computed } from 'vue';
import AppBarButtonLink from "@/components/AppBarButtonLink.vue";

const { state, logout } = useAuthService();

const isAuthenticated = computed(() => state.authenticated);

const isAdmin = computed(() => state.userRole === "admin");
const isUser = computed(() => state.userRole === "user");

const isAny = computed(() => isAdmin.value || isUser.value );

const drawer = ref(false);
const isDesktop = ref(window.innerWidth >= 960);

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 960;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <v-app-bar class="mb-10" color="background" elevation="0">
    <v-container class="d-flex align-center justify-center">
      <template v-if="isDesktop">
        <v-app-bar-nav-icon :style="{ visibility: 'hidden'}"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <AppBarButtonLink route-name="Home">Domů</AppBarButtonLink>
        <AppBarButtonLink route-name="Vehicles">Vozidla</AppBarButtonLink>
        <AppBarButtonLink v-if="isAny" route-name="Reservations">Rezervace</AppBarButtonLink>
        <AppBarButtonLink v-if="isAdmin" route-name="Admin-vehicles">Správa vozidel</AppBarButtonLink>
        <AppBarButtonLink v-if="isAdmin" route-name="Admin-reservations">Správa rezervací</AppBarButtonLink>
        <v-spacer></v-spacer>
        <v-btn v-if="!isAuthenticated" icon variant="elevated" :to="{ name: 'Login' }">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn v-else variant="plain" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>

      <template v-else>
        <v-spacer></v-spacer>
        <v-btn id="navMenuButton" icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary :class="{ 'text-center fill-height w-100' : drawer }" location="right" :disable-route-watcher="false">
    <v-list>
      <v-list-item :to="{ name: 'Home' }">
          <v-list-item-title>Domů</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'Vehicles' }">
          <v-list-item-title>Vozidla</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isAny" :to="{ name: 'Reservations' }">
        <v-list-item-title>Rezervace</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isAdmin" :to="{ name: 'Admin-vehicles' }">
        <v-list-item-title>Správa vozidel</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isAdmin" :to="{ name: 'Admin-reservations' }">
        <v-list-item-title>Správa rezervací</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!isAuthenticated" :to="{ name: 'Login' }">
        <v-list-item-title>Přihlášení</v-list-item-title>
      </v-list-item>
      <v-list-item v-else @click="logout">
        <v-icon>mdi-logout</v-icon>
        <v-list-item-title>Odhlásit</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
