import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MeetingPage = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const addTracksToPeerConnection = () => {
    console.log("adding tracks to peer connection");
    streamRef.current?.getTracks().forEach((track) => {
      if (streamRef.current) {
        pcRef.current?.addTrack(track, streamRef.current);
      }
    });
  };

  const callPeers = async () => {
    await createPeerConnection();

    // add tracks
    addTracksToPeerConnection();

    // create offer
    try {
      console.log("creating offer");
      const description = await pcRef.current?.createOffer();
      await pcRef.current?.setLocalDescription(description);
      console.log("sending offer to others:", pcRef.current?.localDescription);
      wsRef.current?.send(
        JSON.stringify({
          type: "sdp",
          data: pcRef?.current?.localDescription,
        })
      );
    } catch (err) {
      console.error("error while creating offer:", err);
    }
  };

  const handleOffer = async (offer: RTCSessionDescription) => {
    await createPeerConnection();

    // set offer
    console.log("received offer, setting remote description:", offer);
    await pcRef.current?.setRemoteDescription(offer);
  };

  const makeAnswer = async () => {
    // add tracks
    addTracksToPeerConnection();

    // create answer
    try {
      console.log("creating answer");
      const description = await pcRef.current?.createAnswer();
      await pcRef.current?.setLocalDescription(description);
      console.log("sending answer to others:", pcRef.current?.localDescription);
      wsRef.current?.send(
        JSON.stringify({
          type: "sdp",
          data: pcRef?.current?.localDescription,
        })
      );
    } catch (err) {
      console.error("error while creating answer:", err);
    }
  };

  const handleIceCandidate = async (iceCandidate: RTCIceCandidate) => {
    try {
      console.log("received ice candidate from others:", iceCandidate);
      await pcRef.current?.addIceCandidate(iceCandidate);
    } catch (err) {
      console.error("error while adding ice candidate:", err);
    }
  };

  const onWebSocketMessageHandler = async (event: MessageEvent<any>) => {
    const message = JSON.parse(event.data);
    if (message.type === "init") {
      await callPeers();
    }
    if (message.type === "ice") {
      await handleIceCandidate(new RTCIceCandidate(message.data));
    }
    if (message.type === "sdp") {
      if (message.data.type === "offer") {
        await handleOffer(new RTCSessionDescription(message.data));
        await makeAnswer();
      } else {
        // receive answer
        // set answer
        console.log(
          "received answer, setting remote description:",
          message.data
        );
        await pcRef.current?.setRemoteDescription(message.data);
      }
    }
  };

  const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      console.log("received ice candidate from STUN servers:", event.candidate);
      wsRef.current?.send(
        JSON.stringify({ type: "ice", data: event.candidate })
      );
    }
  };

  const onTrack = (event: RTCTrackEvent) => {
    console.log("received others track:", event.streams);
    console.log(event.streams[0].getTracks());
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  const createPeerConnection = async () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
          urls: `turn:${process.env.REACT_APP_TURN_SERVER_IP}:${process.env.REACT_APP_TURN_SERVER_PORT}`,
          username: process.env.REACT_APP_TURN_SERVER_USERNAME,
          credential: process.env.REACT_APP_TURN_SERVER_PASSWORD,
        },
      ],
    });
    pcRef.current = peerConnection;

    peerConnection.onicecandidate = onIceCandidate;
    peerConnection.ontrack = onTrack;
  };

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error while accessing camera: ", err);
      }

      const socket = new WebSocket(
        `${process.env.REACT_APP_MEETING_WEBSOCKET_URL}?id=${id}`
      );
      // const socket = new WebSocket(`ws://localhost:8000/ws?id=${id}`);
      wsRef.current = socket;

      socket.addEventListener("open", (event) => {
        socket.send(
          JSON.stringify({
            type: "init",
            message: "connection established to server",
          })
        );
      });

      socket.addEventListener("message", onWebSocketMessageHandler);
    };

    getCameraStream();

    // return () => socket.close();
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="md:flex md:justify-between gap-5">
        <div className="flex flex-col w-full">
          <p>Your camera:</p>
          <video
            className="bg-black w-full h-[400px]"
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          ></video>
        </div>
        <div className="flex flex-col w-full">
          <p>Others camera:</p>
          <video
            className="bg-black w-full h-[400px]"
            ref={remoteVideoRef}
            autoPlay
            playsInline
          ></video>
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
