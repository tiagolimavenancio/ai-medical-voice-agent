"use client";
import AddNewSessionDialog from "@/app/(routes)/dashboard/_components/AddNewSessionDialog";
import Image from "next/image";
import { useState } from "react";

function HistoryList() {
  const [historyList, setHistoryList] = useState([]);

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2">
          <Image src={"/medical-assistance.png"} alt="empty" width={150} height={150} />
          <h2 className="font-bold text-xl mt-5">No Consultations Yet</h2>
          <p className="text-gray-500">
            You don&apos;t have any consultations with any doctor yet.
          </p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  );
}

export default HistoryList;
