// AddNewSessionDialog.tsx
"use client";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import { Doctor } from "./DoctorACard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetail } from "../medical-agent/[sessionid]/page";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctor] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);

  const router = useRouter();
  const { has } = useAuth();
  // Check if the user has a "pro" plan. This assumes your Clerk setup includes plans.
  const paidUser = typeof has === "function" && has({ plan: "pro" });

  useEffect(() => {
    getHistoryList();
  }, []);

  // Function to fetch the list of past sessions.
  const getHistoryList = async () => {
    try {
      // FIX: Changed the API endpoint to one that should fetch all session history.
      // The previous endpoint '/api/session-chat?sessionid=all' was causing a 400 error
      // because that route is likely designed to fetch a SINGLE session by its ID.
      // You will need to create a new backend API route at '/api/session-history'
      // that returns an array of all session details for the logged-in user.
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log("📜 Session History:", result.data);
      // Assuming the API returns an object with a 'data' property containing the array.
      setHistoryList(result.data?.data || []);
    } catch (error) {
      console.error("❌ Error fetching session history:", error);
      // Set history to an empty array on failure to prevent crashes.
      setHistoryList([]);
    }
  };

  // Function to get doctor suggestions based on user notes.
  const onClickNext = async () => {
    if (!note.trim()) return;

    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", { notes: note });

      console.log("✅ Doctor suggestion response:", result.data);
      const doctors = result.data?.doctors;

      if (!Array.isArray(doctors)) {
        console.warn("⚠️ API did not return a valid 'doctors' array.");
      }

      setSuggestedDoctor(doctors || []);
      setSelectedDoctor(null); // Reset selection when new suggestions are loaded
    } catch (error) {
      console.error("❌ Error suggesting doctors:", error);
      setSuggestedDoctor([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new session and start the consultation.
  const onStartConsultation = async () => {
    if (!selectedDoctor || loading) return;

    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });

      console.log("➡️ Consultation creation response:", result.data);
      // Ensure the session ID is correctly extracted from the response.
      const sessionid = result.data?.data?.sessionid;

      if (!sessionid) {
        console.error("❌ sessionId missing in API response:", result.data);
        // Optionally, show an error to the user here.
        return;
      }

      console.log("🔁 Redirecting to session:", sessionid);
      router.push(`/dashboard/medical-agent/${sessionid}`);
    } catch (error) {
      console.error("❌ Error starting consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    // Reset state on close
    setNote("");
    setSuggestedDoctor([]);
    setSelectedDoctor(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Disable button for non-paying users if they already have 1 or more sessions */}
        <Button className="mt-3" disabled={!paidUser && historyList.length >= 1}>
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
                  placeholder="e.g., I have a headache and a sore throat..."
                  className="h-[200px] mt-1"
                  onChange={(e) => setNote(e.target.value)}
                  value={note}
                />
              </div>
            ) : (
              <div>
                <h2 className="mb-3 font-semibold">Our AI suggests the following specialists:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {suggestedDoctors.map((doctor) => (
                    <SuggestedDoctorCard
                      key={doctor.id}
                      doctorAgent={doctor}
                      setSelectedDoctor={setSelectedDoctor}
                      isSelected={selectedDoctor?.id === doctor.id}
                    />
                  ))}
                </div>
                {suggestedDoctors.length === 0 && !loading && (
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
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>

          {!suggestedDoctors.length ? (
            <Button disabled={!note.trim() || loading} onClick={onClickNext}>
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Next
            </Button>
          ) : (
            <Button disabled={loading || !selectedDoctor} onClick={onStartConsultation}>
              {loading ? (
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
