import DoctorAgentCard from "@/app/(routes)/dashboard/_components/DoctorAgentCard";
import { AIDoctorAgents } from "@/shared/list";

function DoctorsAgentList() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold">AI Specialist Doctors Agents</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
        {AIDoctorAgents.map((doctor) => (
          <div key={doctor.id}>
            <DoctorAgentCard doctor={doctor} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
