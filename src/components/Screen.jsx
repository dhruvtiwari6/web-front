import React, { useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { ModalContext } from '../Context/ModalStateProvider';

function Screen() {
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);

  const { roomId } = useContext(ModalContext);
  const [remoteStreams, setRemoteStreams] = useState([]); // Array to store remote streams

  const constraints = {
    audio: true,
    video: true,
  };

  const createPeerConnection = (socketId) => {
    const peerConnection = new RTCPeerConnection();

    // Add local tracks to the peer connectionss
    localStream.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.current);
    });

    // Handle receiving remote tracks
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStreams((prevStreams) => [
        ...prevStreams.filter((stream) => stream.id !== remoteStream.id),
        { id: socketId, stream: remoteStream },
      ]);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: event.candidate, to: socketId });
      }
    };

    return peerConnection;
  };

  const handleUserConnection = (socketId) => {
    const peerConnection = createPeerConnection(socketId);
    peerConnections.current[socketId] = peerConnection;

    // Create an offer and send it to the remote peer
    peerConnection.createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        socketRef.current.emit('offer', { sdp: peerConnections.current[socketId].localDescription, to: socketId });
      })
      .catch((error) => console.error('Error creating or sending offer:', error));
  };

  useEffect(() => {
    socketRef.current = io('ws://localhost:3000');
    const socket = socketRef.current;

    const attachLocalStream = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia(constraints);
        localVideoRef.current.srcObject = localStream.current;

        socket.emit('local-found', roomId);

        // Listen for new user connections
        socket.on('user-connected', (socketId) => {
          console.log(`User connected: ${socketId}`);
          handleUserConnection(socketId);
        });

        // Handle incoming offers
        socket.on('offer', async ({ sdp, from }) => {
          const peerConnection = createPeerConnection(from);
          peerConnections.current[from] = peerConnection;

          await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socket.emit('answer', { sdp: answer, to: from });
        });

        // Handle incoming answers
        socket.on('answer', async ({ sdp, from }) => {
          const peerConnection = peerConnections.current[from];
          if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
          }
        });

        // Handle incoming ICE candidates
        socket.on('ice-candidate', async ({ candidate, from }) => {
          const peerConnection = peerConnections.current[from];
          if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Handle user disconnections
        socket.on('user-disconnected', (socketId) => {
          console.log(`User disconnected: ${socketId}`);
          const peerConnection = peerConnections.current[socketId];
          if (peerConnection) {
            peerConnection.close();
            delete peerConnections.current[socketId];
          }
          setRemoteStreams((prevStreams) =>
            prevStreams.filter((stream) => stream.id !== socketId)
          );
        });
      } catch (error) {
        console.error('Error attaching local stream:', error);
      }
    };

    attachLocalStream();

    return () => {
      // Cleanup on component unmount
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <div>Local Video</div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        id="local-pc"
        style={{ transform: 'scaleX(-1)' }}
      ></video>

      <div>Remote Videos</div>
      <div>
        {remoteStreams.map(({ id, stream }) => (
          <video
            key={id}
            autoPlay
            playsInline
            style={{ transform: 'scaleX(-1)', margin: '10px', width: '200px' }}
            ref={(ref) => {
              if (ref && ref.srcObject !== stream) {
                ref.srcObject = stream;
              }
            }}
          ></video>
        ))}
      </div>
    </div>
  );
}

export default Screen;
