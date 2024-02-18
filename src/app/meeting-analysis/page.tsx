import { ChatGPTComponent } from "@/components/ChatGPTComponent";
import { getMessages } from "@/utils/chatGPT";
import { chatCompletion } from "@/utils/modelAPI";
import { getPrompt } from "@/utils/prompt";

const MeetingAnalysis = async () => {

  const question = `harpreet says: Hi there, welcome
  ankur says: hi harpreet, lets talk about sql and its triggers
  harpreet: ok triggeres are xyz
  jack joined... jack says: lets discussion about assemble`;
  const agenda = "SQL and its triggers";
  const prompt = getPrompt(question, agenda);

  //const data: string | undefined = await getMessages(prompt);
  const data = await chatCompletion(prompt);

  return <ChatGPTComponent data={data} />;
};

export default MeetingAnalysis;
