import { MeetingAnalysis } from "@/components/MeetingAnalysis";
import { getCache, init } from "@/utils/cacheUtil";

const MeetingAnalysisPage = async () => {
  await init();
  const agenda = await getCache('agenda')
  return <MeetingAnalysis agenda={agenda}/>;
};

export default MeetingAnalysisPage;
