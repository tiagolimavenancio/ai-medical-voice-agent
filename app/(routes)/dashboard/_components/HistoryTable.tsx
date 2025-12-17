import ViewReportDialog from "@/app/(routes)/dashboard/_components/ViewReportDialog";
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";

type HistoryTableProps = {
  historyList: SessionDetail[];
};

function HistoryTable({ historyList }: HistoryTableProps) {
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetail) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
              <TableCell className="text-right">
                <ViewReportDialog record={record} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
