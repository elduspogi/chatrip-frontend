<script lang="ts" setup>
const lists = [
  { title: 'Terms of Service', path: '/terms-of-service' },
  { title: 'Privacy Policy', path: '/privacy-policy' },
  { title: 'Community Guidelines', path: '/community-guidelines' }
];

</script>

<template>
  <footer class="py-6">
    <div class="flex justify-center">
      <p class="px-4">&copy; Chatrip 2025</p>

      <ul class="flex list-disc">
        <RouterLink
          class="px-4 underline text-[#5500FF]"
          v-for="(list, index) in lists"
          :key="index"
          :to="list.path"
        >
          <li>{{ list.title }}</li>
        </RouterLink>
      </ul>
    </div>
  </footer>
</template>
