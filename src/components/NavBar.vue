<script lang="ts" setup>
import Logo from "@/assets/images/chatrip-logo.png";
import { ref } from "vue";
import { useRoute } from "vue-router";

const routes = [
  { path: "/", name: "Home" },
  { path: "/how-it-works", name: "How it works" },
  { path: "/faqs", name: "FAQs" },
]

const currentRoute = useRoute();

const openMenu = ref<boolean>(false);

function toggleMenu() {
  openMenu.value = !openMenu.value;
}
</script>

<template>
  <nav class="flex items-center justify-between flex-wrap bg-white drop-shadow-md p-2 md:py-4">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <RouterLink to="/">
        <img class="h-10 md:h-12" :src=Logo alt="Chatrip Logo">
      </RouterLink>
    </div>
    <!-- Hamburger Menu -->
    <div class="block lg:hidden md:mr-2">
      <button @click="toggleMenu" :class="['flex items-center py-1 px-2 rounded-md', openMenu ? 'outline-solid outline-[#FFB7CB]' : '']">
        <font-awesome-icon :icon="['fas', 'bars']" class="text-xl md:text-2xl text-[#FFB7CB]" />
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

    <div v-show="openMenu" class="w-full block flex-grow lg:hidden">
      <div class="text-sm lg:hidden lg:flex-grow justify-end">
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
