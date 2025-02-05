<script setup lang="ts">
import {useAuthService} from "@/composables/useAuthService";
import {ref} from "vue";
import Error from "@/components/Error.vue";


const { login, state } = useAuthService();
const email = ref('');
const password = ref('');

const error = ref<string | null>(null);

const onSubmit = async () => {
  try{
    await login(email.value, password.value);
  }catch (err: any) {
    error.value = err.message;
  }
};
</script>

<template>
  <v-container class="mt-10">
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12" lg="5" md="8" >
        <h1>Přihlášení</h1>
        <Error v-if="error" :message=error></Error>
        <v-card variant="elevated" elevation="5" color="indigo-darken-3" class="pa-10" >
        <v-form @submit.prevent="onSubmit">
          <v-text-field variant="outlined" v-model="email" label="Email" type="email" required></v-text-field>
          <v-text-field variant="outlined" v-model="password" label="Heslo" type="password" required></v-text-field>
          <v-btn :disabled="state.loading" type="submit">
            <template v-if="state.loading">
              <v-progress-circular
                indeterminate
                color="white"
                size="24"
              ></v-progress-circular>
            </template>
            <template v-else>
              Přihlásit se
            </template>
          </v-btn>
        </v-form>
        <p class="pt-2 pb-5">
          Ještě nemáte účet ?
          <router-link :to="{ name: 'Register' }">
            Registrace</router-link>
        </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
