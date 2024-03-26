import { MeetingAnalysis } from "@/components/MeetingAnalysis";
import prisma from "@/lib/prisma";

const MeetingAnalysisPage = async ({ params }: { params: { id: string } }) => {
  const result = await prisma.meeting.findUnique({
    where: {id: Number(params.id)}
  });
  return <MeetingAnalysis meeting={result} />;
};

export default MeetingAnalysisPage;
