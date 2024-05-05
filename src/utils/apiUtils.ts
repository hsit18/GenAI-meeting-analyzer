export const askModel = async (meetingId: number, query: string, responseKey: string, format: string) => {
  const res = await fetch(`/api/ask-model`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      format,
      id: meetingId,
      responseKey,
    }),
  });
  return await res.json();
};
