/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
  subscriptionRequired: boolean;
};

type DoctorAgentCardProps = {
  doctor: DoctorAgent;
};

function DoctorAgentCard({ doctor }: DoctorAgentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { has } = useAuth();

  const isPaidUser = has && has({ plan: "pro" });

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleStartConsultation = async () => {
    setIsLoading(true);

    try {
      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctor,
      });

      const sessionId = result.data?.data?.sessionId;

      if (!sessionId) {
        return;
      }

      router.push("/dashboard/medical-agent/" + sessionId);
    } catch (e: any) {
      console.error("❌ Error starting consultation:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white shadow-md rounded-xl overflow-hidden group transition hover:shadow-xl"
    >
      {doctor.subscriptionRequired && (
        <Badge className="absolute top-2 right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Premium
        </Badge>
      )}
      <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        <Image
          src={doctor.image}
          alt={doctor.specialist}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{doctor.specialist}</h2>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{doctor.description}</p>

        <Button
          disabled={!isPaidUser && doctor.subscriptionRequired}
          className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700"
          onClick={handleStartConsultation}
        >
          {isLoading ? (
            <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <IconArrowRight className="h-4 w-4 mr-2" />
          )}
          Start Consultation
        </Button>
      </div>
    </div>
  );
}

export default DoctorAgentCard;
