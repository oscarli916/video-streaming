import { Box, Tab, Tabs } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import OfferField from "../components/demo/OfferField";
import AnswerField from "../components/demo/AnswerField";

const DemoPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localSDP, setLocalSDP] = useState("");
  const [offerInput, setOfferInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");

  const createOffer = async () => {
    const offer = await pc?.createOffer();
    pc?.setLocalDescription(offer);
  };

  const setOffer = async () => {
    await pc?.setRemoteDescription(JSON.parse(offerInput));
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
      setLocalSDP(JSON.stringify(peerConnection.localDescription));
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
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
      peerConnection.close();
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="md:flex md:justify-between gap-5">
        <div className="flex flex-col w-full">
          <p>Your camera:</p>
          <video
            className="bg-black w-full "
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
          ></video>
        </div>
        <div className="flex flex-col w-full">
          <p>Others camera:</p>
          <video
            className="bg-black w-full"
            ref={remoteVideoRef}
            autoPlay
            playsInline
          ></video>
        </div>
      </div>
      <div>
        <p>Connected: {pc?.connectionState}</p>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="I'm an offer" />
          <Tab label="I'm an answer" />
        </Tabs>
      </Box>
      <OfferField
        value={tabValue}
        index={0}
        createOffer={createOffer}
        setAnswer={setAnswer}
        localSDP={localSDP}
        answerInput={answerInput}
        setAnswerInput={setAnswerInput}
      />
      <AnswerField
        value={tabValue}
        index={1}
        setOffer={setOffer}
        offerInput={offerInput}
        setOfferInput={setOfferInput}
        createAnswer={createAnswer}
        localSDP={localSDP}
      />
    </div>
  );
};

export default DemoPage;
