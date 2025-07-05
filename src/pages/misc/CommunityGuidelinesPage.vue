<script lang="ts" setup>
import FooterSection from '@/components/FooterSection.vue';
import { scrollToTop } from '@/lib/scroll-to-top';
import { communityGuidelinesContent } from '@/texts';

scrollToTop();
</script>

<template>
  <div class="px-1 md:px-30 lg:px-[250px] xl:px-[200px] 2xl:px-[600px]">
    <h1 class="font-bold text-2xl lg:text-5xl text-center pt-12 pb-8">Community Guidelines</h1>
    <div class="border-4 bg-white mt-4 rounded-xl p-4">
      <h1 class="text-end"><span class="font-bold">Effective Date:</span> July 1, 2025</h1>
      <p class="py-4">To keep <span class="font-bold">Chatrip</span> a safe, fun, and respectful place to meet new people, we ask all users to follow these Community Guidelines.</p>
      <div
        v-for="(content, index) in communityGuidelinesContent"
        :key="index"
        class="py-4"
      >
        <h1 class="font-bold">{{ index + 1 }}. {{ content.title }}</h1>
        <p>
          {{ content.text }}
        </p>

        <ul v-if="content.list" class="list-disc px-8 py-2">
          <li
            v-for="(item, index) in content.list"
            :key="index"
          >{{  item.text }}</li>
        </ul>
      </div>
    </div>

    <FooterSection />
  </div>
</template>
