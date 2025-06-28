<script lang="ts" setup>
import Logo from "@/assets/images/chatrip-logo.png";
import { useRoute } from "vue-router";

const routes = [
  { path: "/", name: "Home" },
  { path: "/how-it-works", name: "How it works" },
  { path: "/FAQs", name: "FAQs" },
]

const currentRoute = useRoute();
</script>

<template>
  <nav class="flex items-center justify-between flex-wrap bg-white drop-shadow-md p-2 md:py-4">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <RouterLink to="/">
        <img class="h-10 md:h-12" :src=Logo alt="Chatrip Logo">
      </RouterLink>
    </div>
    <!-- Hamburger Menu -->
    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-black border-black hover:text-white hover:border-white">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>
    <!-- Menu List -->
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm hidden lg:flex lg:flex-grow justify-end">
        <RouterLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          :class="[
            'block mt-4 lg:inline-block lg:mt-0  text-[16px] mr-4',
            currentRoute.path === route.path ? 'font-bold text-[#FFB7CB]': 'text-black']"
        >
          {{  route.name }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
