<script lang="ts" setup>
import type { ButtonType, PathType } from '@/types';


const props = defineProps<{
  type: ButtonType;
  path: PathType;
}>()
</script>

<template>
    <a :href="props.path">
      <button
        :class="['text-center w-full h-12 border-4 rounded-md font-bold cursor-pointer transition-colors duration-500', props.type === 'Text' ? 'bg-[#FFB7CB] hover:bg-[#ff7fa3]' : 'bg-[#BBD3FF] hover:bg-[#5f97ff]']">{{ props.type }}</button>
    </a>

</template>
