<script setup lang="ts">
import FooterSection from '@/components/FooterSection.vue';
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />

    <main class="flex-1 overflow-hidden">
      <slot />
    </main>

    <FooterSection />
  </div>
</template>
