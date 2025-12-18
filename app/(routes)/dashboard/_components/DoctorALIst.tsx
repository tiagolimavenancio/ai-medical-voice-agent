import React from "react";
import { doctorList } from "@/shared/list";
// Adjust the import path as necessary
import { Doctor } from "./DoctorACard";

import DoctorACard from "./DoctorACard";
// Adjust the import path as necessary

function DoctorALIst() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI specialist Doctor</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctorList.map((doc) => (
          <DoctorACard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
}

export default DoctorALIst;
