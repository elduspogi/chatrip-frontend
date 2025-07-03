<script setup lang="ts">
import TextChat from '@/components/TextChat.vue';

/**
 * FOR UNCOMMENT
 */
// import Peer from 'peerjs';

import { Socket } from 'socket.io-client';
import { onMounted, onUnmounted, ref } from 'vue';

const receivedData = ref<Socket>();

function handleChildData(data: Socket) {
  receivedData.value = data;
  console.log(data);
}

let stream: MediaStream;

onMounted(() => {
  // Init camera
  const videoGrid = document.getElementById('videoGrid') as HTMLVideoElement;
  const strangerVideoGrid = document.getElementById('strangerVideoGrid') as HTMLVideoElement;
  // const userPeer = new Peer();

  const myVideo: HTMLVideoElement = document.createElement('video');
  myVideo.classList.add('video-el');
  myVideo.muted = true;

  const strangerVideo: HTMLVideoElement = document.createElement('video');
  strangerVideo.classList.add('video-el');
  strangerVideo.muted = true;

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(args => {
    stream = args;
    addVideoStream(myVideo, stream, videoGrid);

    /**
     * FOR REMOVAL, CONNECT STRANGER WHEN 'find-partner' is successful
     */
    addVideoStream(strangerVideo, stream, strangerVideoGrid);
  })

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream, camera: HTMLVideoElement) {
    console.log(videoGrid);
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => { // Play the video as it loads
        video.play()
    })
    camera.append(video) // Append video element to videoGrid
  }
})

onUnmounted(() => {
  if(stream) {
    stream.getTracks().forEach(track => track.stop());
  }
})
</script>

<template>
  <section class="grid grid-cols-1 lg:grid-cols-[30%_70%]">
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-2 m-2 lg:mr-0">
      <div class="w-full h-[100px] md:h-[200px] lg:h-full bg-white border-4 rounded-xl video-grid" id="strangerVideoGrid">
        <!-- populate <video> tag here -->
      </div>

      <div class="w-full h-[100px] md:h-[200px] lg:h-full bg-white border-4 rounded-xl video-grid" id="videoGrid">
        <!-- populate <video> tag here -->
      </div>
    </div>
    <TextChat @pass-socket="handleChildData" />
  </section>
</template>
