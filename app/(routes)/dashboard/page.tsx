import AddNewSessionDialog from "@/app/(routes)/dashboard/_components/AddNewSessionDialog";
import DoctorsAgentList from "@/app/(routes)/dashboard/_components/DoctorsAgentList";
import HistoryList from "@/app/(routes)/dashboard/_components/HistoryList";

function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddNewSessionDialog />
      </div>

      <HistoryList />
      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;
