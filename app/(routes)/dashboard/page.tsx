import DoctorsAgentList from "@/app/(routes)/dashboard/_components/DoctorsAgentList";
import HistoryList from "@/app/(routes)/dashboard/_components/HistoryList";
import { Button } from "@/components/ui/button";

function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <Button>+ Consult With Doctor</Button>
      </div>
      <HistoryList />
      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;
