"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AddNewSessionDialog from "@/app/(routes)/dashboard/_components/AddNewSessionDialog";
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";
import Image from "next/image";
import HistoryTable from "@/app/(routes)/dashboard/_components/HistoryTable";

function HistoryList() {
  const [history, setHistory] = useState<SessionDetail[]>([]);

  useEffect(() => {
    const getHistoryList = async () => {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistory(result.data);
    };

    getHistoryList();
  }, []);

  return (
    <div className="p-10 bg-white shadow-lg rounded-xl min-h-[300px]">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Image
            src={"/medical-assistance.png"}
            alt="No history available"
            width={120}
            height={120}
          />
          <h2 className="text-lg font-semibold text-gray-700">No Recent Consultations</h2>
          <p className="text-sm text-gray-500">
            It seems you haven't had any consultations yet. Start your journey to better health by
            booking your first appointment today!
          </p>
          <AddNewSessionDialog />
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
