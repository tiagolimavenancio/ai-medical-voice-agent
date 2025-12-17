"use client";
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
import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctor] = useState<DoctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent | null>(null);

  const router = useRouter();

  const onClickNext = () => {
    if (!note || note.trim().length < 3) {
      return;
    }

    setIsLoading(true);

    try {
      const response = axios.post("/api/suggest-docters", {
        notes: note,
      });

      console.log({ response });
      // const { data } = response;
      // setSuggestedDoctor(data);
    } catch (error) {
      console.log("Error fetching doctor suggestion: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultation = async () => {
    setIsLoading(true);

    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });

    console.log(result.data);

    if (result.data.sessionId) {
      router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    }

    setIsLoading(false);
  };

  const handleCancle = () => {
    setSuggestedDoctor([]);
    setSelectedDoctor(null);
    setNote("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Disable button for non-paying users if they already have 1 or more sessions */}
        <Button className="mt-3">+ Start a Consultation</Button>
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
