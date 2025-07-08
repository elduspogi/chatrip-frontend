import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./pages/LandingPage.vue";
import TextChatPage from "./pages/TextChatPage.vue";
import VideoChatPage from "./pages/VideoChatPage.vue";
import Error404Page from "./pages/Error404Page.vue";
import BaseLayout from "./layouts/BaseLayout.vue";
import TermsOfServicePage from "./pages/misc/TermsOfServicePage.vue";
import PrivacyPolicyPage from "./pages/misc/PrivacyPolicyPage.vue";
import CommunityGuidelinesPage from "./pages/misc/CommunityGuidelinesPage.vue";
import ChatLayout from "./layouts/ChatLayout.vue";

const routes = [
  { path: '/', component: LandingPage, meta: { layout: BaseLayout }, name: 'landing-page' },
  { path: '/text', component: TextChatPage, meta: { layout: ChatLayout }, name: 'text' },
  { path: '/video', component: VideoChatPage, meta: { layout: ChatLayout }, name: 'video' },
  { path: '/terms-of-service', component: TermsOfServicePage, meta: { layout: BaseLayout } },
  { path: '/privacy-policy', component: PrivacyPolicyPage, meta: { layout: BaseLayout } },
  { path: '/community-guidelines', component: CommunityGuidelinesPage, meta: { layout: BaseLayout } },
  { path: '/:catchAll(.*)', component: Error404Page, meta: { layout: ChatLayout } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
