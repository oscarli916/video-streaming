import { Button, TextField } from "@mui/material";
import { useRef, useState, useEffect } from "react";

const DemoPage = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localSDP, setLocalSDP] = useState("");
  const [offerInput, setOfferInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");

  const createOffer = async () => {
    const offer = await pc?.createOffer();
    console.log(`created offer: ${JSON.stringify(offer)}`);
    pc?.setLocalDescription(offer);
  };

  const setOffer = async () => {
    await pc?.setRemoteDescription(JSON.parse(offerInput));
    console.log("offer set");
  };

  const createAnswer = async () => {
    const answer = await pc?.createAnswer();
    pc?.setLocalDescription(answer);
  };

  const setAnswer = async () => {
    await pc?.setRemoteDescription(JSON.parse(answerInput));
  };

  useEffect(() => {
    const peerConnection = new RTCPeerConnection();
    setPc(peerConnection);
    peerConnection.onicecandidate = (event) => {
      console.log(
        `New Ice Candidate received. SDP: ${JSON.stringify(
          peerConnection.localDescription
        )}`
      );
      setLocalSDP(JSON.stringify(peerConnection.localDescription));
    };

    peerConnection.ontrack = (event) => {
      console.log("receiving tracks");
      console.log(event.streams);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      } catch (err) {
        console.error("Error while accessing camera: ", err);
      }
    };

    getCameraStream();

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (
          localVideoRef.current.srcObject as MediaStream
        ).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="md:w-[1000px] flex flex-col">
      <div className="md:flex md:justify-between">
        <video
          className="bg-black w-[300px]"
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
        ></video>
        <video
          className="bg-black w-[300px]"
          ref={remoteVideoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div className="flex flex-col mt-10 gap-2">
        <Button variant="contained" onClick={createOffer}>
          Create Offer
        </Button>
        <TextField
          label="SDP Offer"
          multiline
          value={offerInput}
          onChange={(e) => setOfferInput(e.target.value)}
        />
        <Button variant="contained" onClick={setOffer}>
          Set Offer
        </Button>
        <Button variant="contained" onClick={createAnswer}>
          Create Answer
        </Button>
        <TextField
          label="SDP Answer"
          multiline
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
        />
        <Button variant="contained" onClick={setAnswer}>
          Set Answer
        </Button>
        <p className="text-wrap">SDP: {localSDP}</p>
      </div>
    </div>
  );
};

export default DemoPage;
