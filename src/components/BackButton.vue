<script lang="ts" setup>

const props = defineProps<{
  title: string;
  path: string;
}>();
</script>

<template>
  <RouterLink
    :to="props.path"
  >
    <button
      class="group bg-[#FFB7CB] hover:bg-[#ff7fa3] hover:cursor-pointer transition-all duration-500 border-5 rounded-2xl px-8 py-2 my-4"
    >
      <font-awesome-icon
        :icon="['fas', 'arrow-left']"
        class="transition-transform duration-500 group-hover:-translate-x-3"
      />
      {{ props.title }}
    </button>
  </RouterLink>
</template>
