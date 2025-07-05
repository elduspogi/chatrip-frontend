import { onMounted } from "vue";

export function scrollToTop() {
  onMounted(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  })
}
