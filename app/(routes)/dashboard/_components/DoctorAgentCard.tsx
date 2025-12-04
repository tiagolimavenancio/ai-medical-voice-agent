import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
};

type DoctorAgentCardProps = {
  doctor: DoctorAgent;
};

function DoctorAgentCard({ doctor }: DoctorAgentCardProps) {
  return (
    <div className="rounded-2xl p-4 cursor-pointer hover:border-primary/40 transition-colors">
      <Image
        className="rounded-xl w-full h-[230px] object-cover"
        src={doctor.image}
        alt={doctor.specialist}
        width={200}
        height={300}
      />
      <h2 className="font-bold mt-1">{doctor.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">{doctor.description}</p>
      <Button variant="outline" className="bg-primary text-white mt-2 w-full">
        Start Consultation <IconArrowRight />
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
