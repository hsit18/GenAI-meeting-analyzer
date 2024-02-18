export const getPrompt = (question: string, agenda: string) => {
    
    return `Can you summarize the discussed topic in the below conversation and list comma seprated points of the topics discused? 
        ${question} [Agenda: ${agenda}]
        once summarized, can you now put percentage on how close and far each person is from the agenda topic and put that in JSON format.
    `;
}