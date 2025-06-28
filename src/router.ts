import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./pages/LandingPage.vue";
import TextChatPage from "./pages/TextChatPage.vue";
import VideoChatPage from "./pages/VideoChatPage.vue";
import Error404Page from "./pages/Error404Page.vue";
import BaseLayout from "./layouts/BaseLayout.vue";

const routes = [
  { path: '/', component: LandingPage, meta: { layout: BaseLayout} },
  { path: '/text', component: TextChatPage, meta: { layout: BaseLayout}},
  { path: '/video', component: VideoChatPage, meta: { layout: BaseLayout} },
  { path: '/:catchAll(.*)', component: Error404Page }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
