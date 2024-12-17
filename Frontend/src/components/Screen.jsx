import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function Screen() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  let localStream = null;

  const constraints = {
    audio: false,
    video: true,
  };

  const createPeerConnection = async () => {
    try {
      // Create a single PeerConnection instance
      const peerConnection = new RTCPeerConnection();

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = (ev) => {
        console.log('add remotetrack success :  ' , ev);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = ev.streams[0];
        }
      };

      peerConnection.addEventListener('icecandidate', async (e) => {
        socketRef.current.emit('ice-candidate', e.candidate);
      });

      socketRef.current.on('ice-candidate', async (candidate) => {
        await peerConnection.addIceCandidate(candidate);
      });

      const sdpOffer = await peerConnection.createOffer({
        iceRestart: true,
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await peerConnection.setLocalDescription(sdpOffer);
      socketRef.current.emit('offer', sdpOffer);


      socketRef.current.on('offer', async(sdpOffer) => {
         await peerConnection.setRemoteDescription(sdpOffer);
         const answer = await peerConnection.createAnswer();
         await peerConnection.setLocalDescription(answer);
         socketRef.current.emit('answer' , answer);
      });

      socketRef.current.on('answer', async (sdp) => {
        console.log(sdp);
        await peerConnection.setRemoteDescription(sdp);
      });

     
    } catch (error) {
      console.log('error in establishing peer connection:', error);
    }
  };

  useEffect(() => {
    // Initialize socket
    socketRef.current = io('ws://localhost:3000');
    const socket = socketRef.current;

    const attachingLocalStream = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        localVideoRef.current.srcObject = localStream;

        socket.emit('local-found');
        createPeerConnection();
      } catch (error) {
        console.log('error in attaching local stream:', error);
      }
    };

    attachingLocalStream();
  }, []);

  return (
    <div>
      <div>local video</div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        id="local-pc"
        style={{ transform: 'scalex(-1)' }}
      ></video>

      <div>Remote Video</div>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        id="remote-pc"
        style={{ transform: 'scalex(-1)' }}
      ></video>

      <div></div>
      <div></div>
    </div>
  );
}

export default Screen;