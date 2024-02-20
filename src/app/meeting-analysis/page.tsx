import { ChatGPTComponent } from "@/components/ChatGPTComponent";
import { getCache } from "@/utils/cacheUtil";
import { getChatResponse, getMessages } from "@/utils/chatGPT";

const MeetingAnalysis = async () => {
  console.log(getCache('meeting'));
  if(!getCache('meeting')) {
    return <ChatGPTComponent data={"No Data"} />;  
  }
  const parsedPrompt = JSON.parse(getCache('meeting') as string);

  const data = await getChatResponse([...parsedPrompt, {role: 'user', content: 'Provide list of participants joined'}]);
  return <ChatGPTComponent data={data} />;
};

export default MeetingAnalysis;
