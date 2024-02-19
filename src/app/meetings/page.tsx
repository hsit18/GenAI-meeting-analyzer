import { MeetingInput } from "@/components/MeetingInput";
import { chatCompletion } from "@/utils/modelAPI";
import {run} from "@/utils/chatGPT"
import { getPrompt } from "@/utils/prompt";

const MeetingPage = async () => {
    const question = `harpreet says: Hi there, welcome
    ankur says: hi harpreet, lets talk about sql and its triggers
    harpreet: ok triggeres are xyz
    jack joined... jack says: lets discussion about assemble`;
    const agenda = "SQL and its triggers";
    const prompt = getPrompt(question, agenda);
    
    // await getData(prompt);

    await run();

    return (
        <MeetingInput />
    )
}

export async function getData(prompt: string) {
    // const threadID = await createThread(prompt);
    // const messages = await getMessages(threadID, "get all result in JSON format only");
    const messages = await chatCompletion(prompt);
    return messages;
}

export default MeetingPage;