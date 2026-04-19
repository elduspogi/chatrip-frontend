export function useWebRTC(socket: { emit: (arg0: string, arg1: RTCIceCandidate) => void; }) {
  let pc: RTCPeerConnection;

  function init(stream: MediaStream) {
    pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate", e.candidate);
    };

    return pc;
  }

  return { init };
}
