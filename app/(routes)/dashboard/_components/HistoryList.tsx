"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DoctorALIst from "./DoctorALIst";
import Doctorsession from "./AddNewSessionDialog";
import HistoryTable from "./HistoryTable";

import { Session } from "inspector/promises";
import axios from "axios";
import { SessionDetail } from "../medical-agent/[sessionid]/page";
import { useEffect } from "react";
function HistoryList() {
  const [history, setHistory] = React.useState<SessionDetail[]>([]);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionid=all");
    console.log(result.data);
    setHistory(result.data);
  };
  return (
    <div className=" p-10 bg-white shadow-lg rounded-xl min-h-[300px]">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Image src="/medical-assi.png" alt="No history available" width={120} height={120} />
          <h2 className="text-lg font-semibold text-gray-700">No Recent Consultations</h2>
          <p className="text-sm text-gray-500">
            It seems you haven't had any consultations yet. Start your journey to better health by
            booking your first appointment today!
          </p>
          <Doctorsession />
        </div>
      ) : (
        <div>
          <HistoryTable historyList={history} />
        </div>
      )}
    </div>
  );
}

export default HistoryList;
