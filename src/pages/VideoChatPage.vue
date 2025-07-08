<script setup lang="ts">
import TextChat from '@/components/TextChat.vue';
import { peer } from '@/lib/peer-instance';
import { Socket } from 'socket.io-client';
import { onMounted, onUnmounted, ref } from 'vue';

let socket: Socket;
const strangerPeerId = ref<string>('');

function handleChildData(socketInstance: Socket) {
  socket = socketInstance;
}

let stream: MediaStream;

onMounted(() => {
  // Init camera
  const videoGrid = document.getElementById('videoGrid') as HTMLVideoElement;
  const strangerVideoGrid = document.getElementById('strangerVideoGrid') as HTMLVideoElement;

  // populate the videoGrid el
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

    const call = peer.call(strangerPeerId.value, stream);
    call.on('stream', (remoteStream) => {
      addVideoStream(strangerVideo, remoteStream, strangerVideoGrid);
    })

    /**
     * FOR REMOVAL, CONNECT STRANGER WHEN 'find-partner' is successful
     */
    // addVideoStream(strangerVideo, stream, strangerVideoGrid);
  })

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream, camera: HTMLVideoElement) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => { // Play the video as it loads
        video.play()
    });

    camera.append(video) // Append video element to videoGrid
  }

  /**
   * FOR REPLACING
   */
  socket.on('matched', (data: { roomId: string, partnerId: string, isQueueing: boolean, userPeerId: string, strangerPeerId: string }) => {
    console.log('userPeerId', data.userPeerId);
    console.log('strangerPeerId', data.strangerPeerId);

    strangerPeerId.value = data.strangerPeerId;

    const conn = peer.connect(strangerPeerId.value);

    conn.on('open', () => {
      console.log('video chat now!');

      addVideoStream(strangerVideo, stream, strangerVideoGrid);
    });
  });

  socket.on('disconnect', () => {
    strangerVideo.remove();
  });

  socket.on('send-user-id', () => {

  })
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
      <div class="w-full h-[100px] md:h-[215px] xl:h-[260px] 2xl:h-[420px] bg-white border-4 border-[#FFB7CB] rounded-xl video-grid" id="strangerVideoGrid">
        <!-- populate <video> tag here -->
      </div>

      <div class="w-full h-[100px] md:h-[215px] xl:h-[260px] 2xl:h-[420px] bg-white border-4 border-[#BBD3FF] rounded-xl video-grid" id="videoGrid">
        <!-- populate <video> tag here -->
      </div>
    </div>
    <TextChat @pass-socket="handleChildData" />
  </section>
</template>
