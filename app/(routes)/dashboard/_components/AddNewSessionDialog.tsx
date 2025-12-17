/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DoctorAgent } from "@/app/(routes)/dashboard/_components/DoctorAgentCard";
import SuggestedDoctorCard from "@/app/(routes)/dashboard/_components/SuggestedDoctorCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctor] = useState<DoctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent | null>(null);
  const [history, setHistory] = useState<SessionDetail[]>([]);
  const router = useRouter();
  const { has } = useAuth();

  const isPaidUser = typeof has === "function" && has({ plan: "pro" });

  useEffect(() => {
    const getHistoryList = async () => {
      try {
        const result = await axios.get("/api/session-chat?sessionId=all");
        setHistory(result.data || []);
      } catch (e: any) {
        setHistory([]);
      }
    };

    getHistoryList();
  }, []);

  const onClickNext = async () => {
    if (!note.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });

      const doctors = result.data?.doctors;

      if (!Array.isArray(doctors)) {
        return;
      }

      setSuggestedDoctor(doctors || []);
      setSelectedDoctor(null);
    } catch (error) {
      console.log("Error fetching doctor suggestion: ", error);
      setSuggestedDoctor([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultation = async () => {
    if (!selectedDoctor || isLoading) return;

    setIsLoading(true);

    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });

      const sessionId = result.data.sessionId;

      if (!sessionId) {
        return;
      }

      router.push(`/dashboard/medical-agent/${sessionId}`);
    } catch (e: any) {
      console.error("❌ Error starting consultation:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancle = () => {
    setSuggestedDoctor([]);
    setSelectedDoctor(null);
    setNote("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3" disabled={!isPaidUser && history.length >= 1}>
          + Start a Consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Consultation</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors.length ? (
              <div>
                <h2 className="mb-2 font-semibold">Describe your symptoms</h2>
                <Textarea
                  value={note}
                  placeholder="e.g., I have a headache and a sore throat..."
                  className="h-[200px] mt-1"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2 className="mb-3 font-semibold">Our AI suggests the following specialists:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {suggestedDoctors.map((doctor) => (
                    <SuggestedDoctorCard
                      key={doctor.id}
                      isSelected={selectedDoctor?.id === doctor.id}
                      doctorAgent={doctor}
                      setSelectedDoctor={setSelectedDoctor}
                    />
                  ))}
                </div>
                {suggestedDoctors.length === 0 && !isLoading && (
                  <p className="text-red-500 mt-4 text-center">
                    ⚠️ No specialists found for the provided symptoms. Please try again with more
                    details.
                  </p>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancle}>
              Cancel
            </Button>
          </DialogClose>

          {!suggestedDoctors.length ? (
            <Button disabled={!note.trim() || isLoading} onClick={onClickNext}>
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Next
            </Button>
          ) : (
            <Button disabled={isLoading || !selectedDoctor} onClick={handleStartConsultation}>
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Start Consultation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
