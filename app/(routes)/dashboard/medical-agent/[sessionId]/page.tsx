/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DoctorAgent } from "@/app/(routes)/dashboard/_components/DoctorAgentCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: DoctorAgent;
  createdOn: string;
  conversation?: any;
};

type Messages = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const fetchDetails = async () => {
      const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
      setSessionDetail(result.data);
    };

    fetchDetails();
  }, [sessionId]);

  const handleConnect = () => {
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const vapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage: "",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail?.selectedDoctor.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [{ role: "system", content: sessionDetail?.selectedDoctor.agentPrompt }],
      },
    };

    // @ts-ignore
    vapi.start(vapiAgentConfig);
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcript, transcriptType } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev: any) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapiInstance.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapiInstance.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });

    setLoading(false);
  };

  const handleDisconnect = async () => {
    if (!vapiInstance) {
      console.warn("No vapi instance to disconnect.");
      return;
    }

    setLoading(true);

    vapiInstance.stop();
    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");

    setCallStarted(false);
    setVapiInstance(null);
    setLoading(false);

    setLoading(false);
  };

  const onGenerateReport = async () => {
    const result = await axios.post("/api/medical-report", { messages, sessionDetail, sessionId });
    return result.data;
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`w-4 h-4 rounded-full ${callStarted ? "bg-green-800" : "bg-red-800"}`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            className="h-[100px] w-[100px] object-cover rounded-full"
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist}
            width={120}
            height={120}
          />
          <h2 className="mt-2 text-lg">{sessionDetail.selectedDoctor.specialist}</h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg: Messages, index) => (
              <h2 key={index} className="text-gray-400">
                {msg.role} {msg.text}
              </h2>
            ))}
            {liveTranscript && liveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole} {liveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button className="mt-8 px-8 py-3 text-lg" disabled={loading} onClick={handleConnect}>
              {loading ? <Loader className="animate-spin mr-2" /> : <PhoneCall className="mr-2" />}{" "}
              Start Call
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="mt-8 px-8 py-3 text-lg"
              disabled={loading}
              onClick={handleDisconnect}
            >
              {loading ? <Loader className="animate-spin" /> : <PhoneOff />} Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
