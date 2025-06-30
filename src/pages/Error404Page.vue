<script lang="ts" setup>
import Error404Img from '@/assets/images/not-found.png'
import BackToHomeButton from '@/components/BackButton.vue';
</script>

<template>
  <section class="flex justify-center">
    <div class="grid grid-cols-1 text-center px-4 py-10">
      <img
        :src="Error404Img"
        alt="Error 404 Image"
        class="w-full md:w-[400px] lg:w-[500px]">

      <p class="text-[30px] md:text-[40px] font-bold p-2">Page not found</p>

      <p class="text-md md:text-lg">Oops! Sorry, should have caught this on development.</p>

      <BackToHomeButton title="Back To Home" path="/" />
    </div>
  </section>
</template>
