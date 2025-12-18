"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Doctor } from "../../_components/DoctorACard"; // Adjust path as necessary
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust path as necessary
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

// Define SessionDetail type, ensuring selectedDoctor matches the Doctor type
export type SessionDetail = {
  id: number;
  notes: string;
  sessionid: string;
  report: JSON;
  selectedDoctor: Doctor;
  createdOn: string;
  conversation?: any;
};

// Define Message type for chat messages
type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callDurationRef = useRef(0);
  const sessionDetailRef = useRef<SessionDetail | null>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    // This effect runs on the client side after the component mounts
    // to extract the session ID from the URL pathname.
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const id = pathParts[pathParts.length - 1];
      if (id) {
        setSessionId(id);
      } else {
        console.warn("⚠️ Could not extract session ID from URL.");
        setLoading(false);
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  useEffect(() => {
    sessionDetailRef.current = sessionDetail;
  }, [sessionDetail]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);

  // Effect to fetch session details when sessionId changes or component mounts
  useEffect(() => {
    // Ensure sessionId is available before fetching
    if (sessionId) {
      GetSessionDetails();
    } else {
      // If no sessionId, stop loading and show an error state.
      console.warn("⚠️ No session ID found in URL.");
    }
  }, [sessionId]);

  // Debugging effect: logs sessionDetail whenever it updates
  useEffect(() => {
    if (sessionDetail) {
      console.log("🔎 Session Detail:", sessionDetail);
      if (!sessionDetail.selectedDoctor) {
        console.warn("❌ selectedDoctor is NULL or MISSING after state update in component.");
      }
    }
  }, [sessionDetail]);

  // Function to fetch session details from your API
  const GetSessionDetails = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`/api/session-chat?sessionid=${sessionId}`);
      console.log("📥 Raw session data from API:", result.data);

      if (result.data) {
        setSessionDetail(result.data);
      } else {
        console.warn("⚠️ No data received for session details from the API.");
        setSessionDetail(null); // Ensure sessionDetail is null on failure
      }
    } catch (error) {
      console.error("❌ Failed to load session details:", error);
      setSessionDetail(null); // Ensure sessionDetail is null on error
    } finally {
      setLoading(false);
    }
  };

  // Function to start the Vapi call
  const StartCall = () => {
    if (!sessionDetail || !sessionDetail.selectedDoctor) {
      console.error("Cannot start call: sessionDetail or selectedDoctor is missing.");
      return;
    }

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const agentPromptContent =
      sessionDetail.selectedDoctor.agentPrompt || "You are a helpful AI medical assistant.";

    // Type as 'any' since CreateAssistantDTO is not exported from the package
    const VapiAgentConfig: any = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage: "Hello! I’m your AI medical assistant. Tell me about your symptoms.",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail.selectedDoctor.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: agentPromptContent,
          },
        ],
      },
    };

    setLoading(true);
    vapi.start(VapiAgentConfig);

    vapi.on("call-start", () => {
      console.log("Vapi Call Started!");
      setCallStarted(true);
      setLoading(false);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    });

    vapi.on("call-end", async () => {
      console.log("Vapi Call Ended!");
      vapi.stop();
      if (timerRef.current) clearInterval(timerRef.current);

      const currentMessages = messagesRef.current;
      const currentDetail = sessionDetailRef.current;

      if (currentMessages.length && currentDetail && sessionId) {
        await GenerateReport(currentMessages, currentDetail, sessionId, callDurationRef.current);
        toast.success("Your Report is Generated!");
        window.location.replace("/dashboard");
      } else {
        console.warn("⚠️ Not generating report: missing messages or sessionDetail");
        window.location.replace("/dashboard");
      }
      setCallStarted(false);
      setLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("error", (e) => {
      console.error("Vapi Error occurred:", e);
      setLoading(false);
      setCallStarted(false);
      if (timerRef.current) clearInterval(timerRef.current);
      console.error("There was an error during the call. Please try again.");
    });
  };

  const handleDisconnect = () => {
    if (!vapiInstance) {
      console.warn("No Vapi instance to disconnect.");
      return;
    }
    setLoading(true);
    vapiInstance.stop();
  };

  const GenerateReport = async (
    messagesData: Message[],
    sessionData: SessionDetail,
    sessionIdVal: string | string[],
    durationInSeconds: number
  ) => {
    try {
      const result = await axios.post("/api/medical-report", {
        messages: messagesData,
        sessionDetail: sessionData,
        sessionId: sessionIdVal,
        durationInSeconds,
      });
      console.log("✅ Report Generated:", result.data);
    } catch (error: any) {
      console.error("❌ Report Generation Failed:", error?.message || error);
    }
  };

  // --- Render Logic ---

  // 1. Show loading spinner while initial session data is being fetched
  if (loading && !sessionDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-blue-500" />
        <p className="ml-3 text-lg">Loading session details...</p>
      </div>
    );
  }

  // 2. Show error message if session data or selected doctor is missing after loading
  if (!sessionDetail || !sessionDetail.selectedDoctor) {
    return (
      <div className="p-5 border rounded-3xl bg-secondary text-red-500 flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-xl font-bold mb-4">⚠️ Could not load session data.</p>
        <p className="text-md mb-2">
          This might be due to an invalid session ID or a network problem.
        </p>
        <p className="text-sm text-gray-400">Please check the URL and try again.</p>
        {sessionDetail && (
          <pre className="text-xs bg-gray-100 p-2 mt-4 rounded max-h-60 overflow-y-auto break-all whitespace-pre-wrap text-left">
            {JSON.stringify(sessionDetail, null, 2)}
          </pre>
        )}
        <Button onClick={() => (window.location.href = "/dashboard")} className="mt-5">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  // 3. Main component render once sessionDetail and selectedDoctor are guaranteed to be available
  return (
    <div className="p-5 border rounded-3xl bg-secondary shadow-md">
      {/* Call Status and Duration */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center text-sm font-medium">
          <Circle
            className={`h-3 w-3 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`}
          />
          {callStarted ? "Connected" : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">
          {String(Math.floor(callDuration / 60)).padStart(2, "0")}:
          {String(callDuration % 60).padStart(2, "0")}
        </h2>
      </div>

      {/* Doctor Information and Call Controls */}
      <div className="flex items-center flex-col mt-10">
        <img
          src={sessionDetail.selectedDoctor.image || "/default-doctor.png"}
          alt={sessionDetail.selectedDoctor.specialist || "Doctor"}
          width={120}
          height={120}
          className="h-[100px] w-[100px] object-cover rounded-full border-2 border-primary"
        />
        <h2 className="mt-3 text-2xl font-semibold text-gray-800">
          {sessionDetail.selectedDoctor.specialist}
        </h2>
        <p className="text-md text-gray-500">AI Medical Voice Agent</p>
        <p className="text-sm text-gray-400 mt-1 max-w-sm text-center">
          {sessionDetail.selectedDoctor.description}
        </p>

        {/* Chat Message Display Area */}
        <div className="mt-12 w-full max-w-2xl px-4 py-3 bg-white rounded-lg shadow-inner overflow-y-auto h-60 max-h-60 custom-scrollbar border">
          {messages.length === 0 && !liveTranscript && !loading && !callStarted && (
            <p className="text-center text-gray-400 italic mt-10">
              Press "Start Call" to begin your consultation.
            </p>
          )}
          {messages.slice(-4).map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === "assistant" ? "text-left" : "text-right"}`}
            >
              <span
                className={`inline-block p-2 rounded-lg text-sm ${
                  msg.role === "assistant"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <span className="font-bold capitalize">{msg.role}:</span> {msg.text}
              </span>
            </div>
          ))}
          {liveTranscript && (
            <div className={`mb-2 ${currentRole === "assistant" ? "text-left" : "text-right"}`}>
              <span
                className={`inline-block p-2 rounded-lg text-sm ${
                  currentRole === "assistant"
                    ? "bg-blue-50 text-blue-600 animate-pulse"
                    : "bg-green-50 text-green-600 animate-pulse"
                }`}
              >
                <span className="font-bold capitalize">{currentRole}:</span> {liveTranscript}...
              </span>
            </div>
          )}
          {loading && callStarted && (
            <div className="text-center text-gray-400 mt-2">
              <Loader className="animate-spin inline-block h-4 w-4 mr-2" /> AI Thinking...
            </div>
          )}
        </div>

        {/* Call Action Buttons */}
        {!callStarted ? (
          <Button className="mt-8 px-8 py-3 text-lg" onClick={StartCall} disabled={loading}>
            {loading ? <Loader className="animate-spin mr-2" /> : <PhoneCall className="mr-2" />}
            Start Call
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="mt-8 px-8 py-3 text-lg"
            onClick={handleDisconnect}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin mr-2" /> : <PhoneOff className="mr-2" />}
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
