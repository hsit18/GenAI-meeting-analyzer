import { ChatGPTComponent } from "@/components/ChatGPTComponent";
import { ChatGPTAPI, ChatMessage } from "chatgpt";

const MeetingAnalysis = async () => {
  async function getData() {
    const question = `harpreet says: Hi there, welcome
    ankur says: hi harpreet, lets talk about sql and its triggers
    harpreet: ok triggeres are xyz
    jack joined... jack says: lets discussion about assemble`;

    const agenda = "SQL and its triggers";

    const prompt = `Can you summarize the discussed topic in the below conversation and list comma seprated points of the topics discused? 
        ${question} [Agenda: ${agenda}]
        once summarized, can you now put percentage on how close and far each person is from the agenda topic and put that in JSON format.
    `;

    console.log(prompt);

    try {
      const api = new ChatGPTAPI({
        apiKey: process.env.OPENAI_API_KEY,
      });

           // return await api.sendMessage(prompt);
    } catch (e) {
      console.error(e);
    }
  }

  const data: ChatMessage | undefined = await getData();
  // return <ChatGPTComponent data={data} />;
};

export default MeetingAnalysis;
