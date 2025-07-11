<script setup lang="ts">
import TextChat from '@/components/TextChat.vue';
import { peer, socket } from '@/lib/peer-instance';
import { onMounted, onUnmounted } from 'vue';

let stream: MediaStream;

const isMediaDevicesOn = sessionStorage.getItem('isMediaDevicesOn');

if(isMediaDevicesOn === 'false' || isMediaDevicesOn === null) {
  window.location.href = '/';
}

onMounted(() => {
  // Init camera
  const videoGrid = document.getElementById('videoGrid') as HTMLDivElement;
  const strangerVideoGrid = document.getElementById('strangerVideoGrid') as HTMLDivElement;

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

    console.log('PeerId: ', peer.id);
    peer.on('call', call => {
      call.answer(stream)
      call.on('stream', strangerVideoStream => {
        addVideoStream(strangerVideo, strangerVideoStream, strangerVideoGrid);
      })
    })

    socket.on('matched', (data: { roomId: string, partnerId: string, isQueueing: boolean, userPeerId: string, strangerPeerId: string }) => {
      connectToNewUser(data.strangerPeerId, stream);
      console.log(data);
    })
  }).catch(err => {
    console.warn(err);
    sessionStorage.removeItem('isMediaDevicesOn');
    window.location.reload()
  })

  function connectToNewUser(strangerPeerId: string, stream: MediaStream) {
    const call = peer.call(strangerPeerId, stream);

    call.on('stream', strangerVideoStream => {
      addVideoStream(strangerVideo, strangerVideoStream, strangerVideoGrid);
      console.log('firing stream on fn connectToNewUser');
    })

    call.on('close', () => {
      strangerVideo.remove();
      console.log('firing remove stranger video')
    })
  }

  function addVideoStream(video: HTMLVideoElement, stream: MediaStream, camera: HTMLDivElement) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => { // Play the video as it loads
        video.play()
    });

    camera.append(video) // Append video element to videoGrid
  }

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
    <TextChat />
  </section>
</template>
