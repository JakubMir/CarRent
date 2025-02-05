<script setup lang="ts">
import {useAuthService} from "@/composables/useAuthService";
import {ref} from "vue";
import Error from "@/components/Error.vue";


const { register, state } = useAuthService();
const email = ref('');
const password = ref('');

const error = ref<string | null>(null);

const onSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Email a heslo jsou povinné.';
    return;
  }
  else if(password.value.length<6){
    error.value = 'Heslo musí mít alespoň 6 znaků';
    return;
  }

  try {
    await register(email.value, password.value)
    error.value = null;
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
<template>
  <v-container class="mt-10">
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12" lg="5" md="8" >
        <h1>Registrace</h1>
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
                Registrovat
              </template>
              </v-btn>
          </v-form>
          <p class="pt-2 pb-5">
            Už máte účet ? <router-link :to="{ name: 'Login' }">Přihlásit se</router-link>
          </p>
        </v-card>
      </v-col>
    </v-row>


  </v-container>
</template>

<style scoped>

</style>
