<script lang="ts" setup>
import { footerSectionContents } from '@/texts';
</script>

<template>
  <footer class="py-6">
    <div class="grid grid-cols-2 md:flex justify-center">
      <p class="px-4">&copy; Chatrip 2025</p>

      <ul class="grid grid-cols-1 md:flex list-disc">
        <RouterLink
          class="px-4 underline text-[#5500FF]"
          v-for="(list, index) in footerSectionContents"
          :key="index"
          :to="list.path"
        >
          <li>{{ list.title }}</li>
        </RouterLink>
      </ul>
    </div>
  </footer>
</template>
