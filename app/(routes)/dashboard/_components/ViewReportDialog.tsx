"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionid]/page";
import moment from "moment";

type ReportType = {
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration?: string;
  severity?: string;
  medicationsMentioned?: string[];
  recommendations?: string[];
};

type ViewReportDialogProps = {
  record: SessionDetail;
};

function ViewReportDialog({ record }: ViewReportDialogProps) {
  const report = record as unknown as ReportType;

  if (!report) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"} size="sm">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full sm:rounded-lg px-4 py-6 sm:p-8">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-xl sm:text-2xl font-bold text-blue-700">
              🩺 Medical AI Voice Agent Report
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 mt-6 text-sm sm:text-base">
              {/* Session Info */}
              <section>
                <h3 className="text-base font-semibold text-blue-600 mb-1">Session Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold">Doctor:</span> {report.agent}
                  </div>
                  <div>
                    <span className="font-semibold">User:</span> {report.user}
                  </div>
                  <div>
                    <span className="font-semibold">Consulted On:</span>{" "}
                    {moment(report.timestamp).format("MMMM Do YYYY, h:mm a")}
                  </div>
                  <div>
                    <span className="font-semibold">Agent:</span> {report.agent}
                  </div>
                </div>
              </section>

              <hr className="border-t border-blue-200 my-2" />

              {/* Chief Complaint */}
              <section>
                <h3 className="text-base font-semibold text-blue-600 mb-1">Chief Complaint</h3>
                <p className="text-gray-800">{report.chiefComplaint}</p>
              </section>

              <hr className="border-t border-blue-200 my-2" />

              {/* Summary */}
              <section>
                <h3 className="text-base font-semibold text-blue-600 mb-1">Summary</h3>
                <p className="text-gray-800">{report.summary}</p>
              </section>

              <hr className="border-t border-blue-200 my-2" />

              {/* Symptoms */}
              <section>
                <h3 className="text-base font-semibold text-blue-600 mb-1">Symptoms</h3>
                <ul className="list-disc list-inside text-gray-800">
                  {report.symptoms?.map((symptom: string, index: number) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </section>

              <hr className="border-t border-blue-200 my-2" />

              {/* Duration & Severity */}
              <section>
                <h3 className="text-base font-semibold text-blue-600 mb-1">Duration & Severity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold">Duration:</span>{" "}
                    {report.duration || "Not specified"}
                  </div>
                  <div>
                    <span className="font-semibold">Severity:</span>{" "}
                    {report.severity || "Not specified"}
                  </div>
                </div>
              </section>

              {/* Medications */}
              {(report.medicationsMentioned ?? []).length > 0 && (
                <>
                  <hr className="border-t border-blue-200 my-2" />
                  <section>
                    <h3 className="text-base font-semibold text-blue-600 mb-1">
                      Medications Mentioned
                    </h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {report.medicationsMentioned!.map((med: string, index: number) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {/* Recommendations */}
              {(report.recommendations ?? []).length > 0 && (
                <>
                  <hr className="border-t border-blue-200 my-2" />
                  <section>
                    <h3 className="text-base font-semibold text-blue-600 mb-1">Recommendations</h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {report.recommendations!.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </section>
                </>
              )}

              {/* Footer Disclaimer */}
              <div className="mt-6 pt-4 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                <div className="flex items-start sm:items-center gap-2">
                  <span className="text-blue-600 text-lg">⚠</span>
                  <span>
                    <strong className="text-gray-700">Note:</strong> This report was generated by an{" "}
                    <strong>AI Medical Assistant</strong> for informational purposes only.
                  </span>
                </div>
                <span>Please consult a licensed healthcare provider for medical advice.</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
