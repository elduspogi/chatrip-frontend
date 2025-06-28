<script setup lang="ts">
import TextChat from '@/components/TextChat.vue';

</script>

<template>
  <section class="grid grid-cols-1 lg:grid-cols-[30%_70%]">
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-2 m-2 lg:mr-0">
      <div class="w-full h-[100px] md:h-[200px] lg:h-full bg-white border-4 rounded-xl">Stranger Cam</div>

      <div class="w-full h-[100px] md:h-[200px] lg:h-full bg-white border-4 rounded-xl">User Cam</div>
    </div>
    <TextChat />
  </section>
</template>
