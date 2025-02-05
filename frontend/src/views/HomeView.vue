<script setup lang="ts">
import HomePageCard from "@/components/HomePageCard.vue";
</script>

<template>
  <v-container>
    <!-- Intro section -->
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold">Vítejte v CarRent!</h1>
        <p class="text-h5 mt-4">
          Vaše spolehlivá půjčovna aut
        </p>
      </v-col>
    </v-row>

    <!-- Services section -->
    <v-row class="mt-12" justify="center">
      <v-col cols="12" md="4" >
        <HomePageCard>
          <template v-slot:cardTitle>Široká nabídka aut</template>
          <template v-slot:cardText>Vyberte si z široké nabídky vozů, vše pro vás připravíme</template>
        </HomePageCard>
      </v-col>
      <v-col cols="12" md="4">
        <HomePageCard>
          <template v-slot:cardTitle>Snadná rezervace</template>
          <template v-slot:cardText>Rezervujte si vůz online během několika vteřin s bezplatnou možností zrušení</template>
        </HomePageCard>
      </v-col>
      <v-col cols="12" md="4">
        <HomePageCard>
          <template v-slot:cardTitle>Flexibilní možnosti</template>
          <template v-slot:cardText>Nabízíme krátkodobé i dlouhodobé pronájmy s platbou při převzetí</template>
        </HomePageCard>
      </v-col>
    </v-row>

    <!-- Benefits -->
    <v-row class="mt-12 text-h6" no-gutters justify="center">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold text-center">Proč si vybrat nás ?</h2>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-center">
        <ul class="mt-4">
          <li>Férové ceny bez skrytých poplatků</li>
          <li>Jednoduchý přehled vašich rezervací</li>
          <li>Pravidelně udržované a čisté vozy</li>
        </ul>
      </v-col>
      <v-col cols="2" class="d-none d-md-block d-xl-none"></v-col>
      <v-col cols="12" md="4" class="d-flex justify-center">
        <ul class="mt-4">
          <li>Možnost doručení vozu na vaši adresu</li>
          <li>Spolehlivý a kvalitní přístup</li>
          <li>Bohatá nabídka vozidel k půjčení</li>
        </ul>
      </v-col>
    </v-row>

    <!-- Call to action -->
    <v-row class="mt-12 text-center mb-10">
      <v-col cols="12" class="justify-center">
        <h2 class="text-h4 font-weight-bold">Připraveni vyrazit ?</h2>
        <v-btn color="primary" large class="mt-4" :to="{ name: 'Vehicles' }">
          Rezervovat auto
        </v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<style>
ul {
  list-style-type: "✔️ ";
}
</style>
