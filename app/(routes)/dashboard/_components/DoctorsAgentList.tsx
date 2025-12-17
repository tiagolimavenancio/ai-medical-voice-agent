import DoctorAgentCard from "@/app/(routes)/dashboard/_components/DoctorAgentCard";
import { doctorList } from "@/shared/list";

function DoctorsAgentList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI specialist Doctor</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctorList.map((doctor) => (
          <DoctorAgentCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
