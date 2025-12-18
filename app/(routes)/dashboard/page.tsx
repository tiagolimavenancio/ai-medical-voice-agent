import React from "react";
import { Button } from "@/components/ui/button";
import HistoryList from "./_components/HistoryList";
import DoctorALIst from "./_components/DoctorALIst";
import Doctorsession from "./_components/AddNewSessionDialog";

function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Doctorsession />
      </div>

      <HistoryList />
      <DoctorALIst />
    </div>
  );
}

export default Dashboard;
