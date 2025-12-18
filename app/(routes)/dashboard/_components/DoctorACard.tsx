"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2Icon, ArrowRight } from "lucide-react";

export type Doctor = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
};

type DoctorACardProps = {
  doctor: Doctor;
};

function DoctorACard({ doctor }: DoctorACardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctor,
      });

      if (result.data?.data?.sessionid) {
        router.push("/dashboard/medical-agent/" + result.data.data.sessionid);
      }
    } catch (error) {
      console.error("❌ Error starting consultation:", error);
    } finally {
      setLoading(false);
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

      {/* Image container with fixed aspect ratio */}
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
          className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700"
          onClick={onStartConsultation}
          disabled={!paidUser && doctor.subscriptionRequired}
        >
          {loading ? (
            <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          Start Consultation
        </Button>
      </div>
    </div>
  );
}

export default DoctorACard;
