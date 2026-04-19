<script setup lang="ts">
import TextChat from '@/components/TextChat.vue';
import { socket } from '@/lib/peer-instance';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { isLoading, isSelfDisconnected } from '@/lib/text-chat-socket';

let stream: MediaStream;
let pc: RTCPeerConnection;
let roomId: string;

let myVideo: HTMLVideoElement;
let strangerVideo: HTMLVideoElement;

const myVideoGrid = ref<HTMLDivElement | null>(null);
const strangerVideoGrid = ref<HTMLDivElement | null>(null);

// =========================
// CREATE VIDEO ELEMENTS
// =========================
function createVideoElements() {
  myVideo = document.createElement('video');
  myVideo.autoplay = true;
  myVideo.muted = true;
  myVideo.playsInline = true;
  myVideo.className = 'w-full h-full object-cover rounded-xl';
  myVideo.srcObject = stream;
  myVideoGrid.value?.appendChild(myVideo);

  strangerVideo = document.createElement('video');
  strangerVideo.autoplay = true;
  strangerVideo.playsInline = true;
  strangerVideo.className = 'w-full h-full object-cover rounded-xl';
  strangerVideoGrid.value?.appendChild(strangerVideo);
}

// =========================
// CLEAR STRANGER VIDEO
// =========================
function clearStrangerVideo() {
  if (strangerVideo) {
    strangerVideo.pause();
    strangerVideo.srcObject = null;
    strangerVideo.load();
  }
}

// =========================
// PEER CONNECTION
// =========================
function setupPeerConnection() {
  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.close();
  }

  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  pc.ontrack = (event) => {
    if (!roomId) return;
    strangerVideo.srcObject = event.streams[0];
    isLoading.value = false;
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', { roomId, candidate: event.candidate });
    }
  };
}

// =========================
// SOCKET HANDLERS
// =========================
async function onMatched(data: { roomId: string; isInitiator: boolean }) {
  roomId = data.roomId;
  setupPeerConnection();

  if (data.isInitiator) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { roomId, offer });
  }
}

async function onOffer(offer: RTCSessionDescriptionInit) {
  try {
    if (pc.signalingState !== 'stable') return;
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', { roomId, answer });
  } catch (err) {
    console.warn('[onOffer] error:', err);
  }
}

async function onAnswer(answer: RTCSessionDescriptionInit) {
  try {
    if (pc.signalingState === 'stable') return; // 👈 already stable, ignore stale answer
    await pc.setRemoteDescription(answer);
  } catch (err) {
    console.warn('[onAnswer] error:', err);
  }
}

async function onIceCandidate(candidate: RTCIceCandidateInit) {
  try {
    if (pc.signalingState === 'closed') return; // 👈 ignore if PC already closed
    await pc.addIceCandidate(candidate);
  } catch (err) {
    console.error('[onIceCandidate] error:', err);
  }
}

function onPartnerDisconnected() {
  roomId = '';
  clearStrangerVideo();

  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.close();
  }

  isLoading.value = false;
  setupPeerConnection();
}

// =========================
// SELF DISCONNECT WATCHER
// =========================
watch(isSelfDisconnected, (val) => {
  if (!val) return;

  clearStrangerVideo();

  if (pc) {
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.close();
  }

  isSelfDisconnected.value = false;
});

// =========================
// LIFECYCLE
// =========================
onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch (err) {
    console.warn(err);
    sessionStorage.removeItem('isMediaDevicesOn');
    window.location.reload();
    return;
  }

  createVideoElements();
  setupPeerConnection();

  socket.on('matched', onMatched);
  socket.on('offer', onOffer);
  socket.on('answer', onAnswer);
  socket.on('ice-candidate', onIceCandidate);
  socket.on('partner-disconnected', onPartnerDisconnected);
});

onUnmounted(() => {
  socket.off('matched', onMatched);
  socket.off('offer', onOffer);
  socket.off('answer', onAnswer);
  socket.off('ice-candidate', onIceCandidate);
  socket.off('partner-disconnected', onPartnerDisconnected);

  clearStrangerVideo();

  if (pc) pc.close();
  if (stream) stream.getTracks().forEach((t) => t.stop());
  isLoading.value = false;
});
</script>

<template>
  <section class="grid grid-cols-1 lg:grid-cols-[30%_70%]">
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-2 m-2 lg:mr-0">

      <div
        ref="strangerVideoGrid"
        class="w-full h-[100px] md:h-[215px] xl:h-[260px] 2xl:h-[420px] bg-white border-4 border-[#FFB7CB] rounded-xl video-grid"
        id="strangerVideoGrid"
      />

      <div
        ref="myVideoGrid"
        class="w-full h-[100px] md:h-[215px] xl:h-[260px] 2xl:h-[420px] bg-white border-4 border-[#BBD3FF] rounded-xl video-grid"
        id="videoGrid"
      />

    </div>

    <TextChat />
  </section>
</template>
