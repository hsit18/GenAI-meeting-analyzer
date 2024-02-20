let messageList = [];

export const getPrompt = (question: string, agenda: string) => {
    
    return `Can you summarize the discussed topic in the below conversation and list comma seprated points of the topics discused? 
        ${question} [Agenda: ${agenda}]
        once summarized, can you now put percentage on how close and far each person is from the agenda topic and put that in JSON format.
    `;
}

export const startAnalysisPrompt = (agenda: string, meetingTranscribe: string) => {
    messageList = [
        { role: 'system', content: 'You need to analysis the meeting transcribe with respect to meeting agenda and provide insight' },
        { role: 'user', content: `Meeting Agenda: ${agenda}` },
        { role: 'user', content: `Meeting Transcribe: ${meetingTranscribe}` },     
    ];
    return messageList;
}

export const getAnalysisPrompt = () => {
    return messageList;
}