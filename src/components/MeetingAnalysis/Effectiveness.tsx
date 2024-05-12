//@ts-nocheck

import React, { useEffect, useState } from "react";

import { askModel } from "@/utils/apiUtils";
import { MeterGauge } from "../shared/MeterGauge";


export const MeetingEffectiveness = ({ meetingId, model }: { meetingId: number, model: string }) => {
  const [value, setValue] = useState(0);
  const getEffectiveness = async () => {
    const effectiveness = await askModel({
      id: meetingId,
      model: model,
      query: "Can you analyse meeting transcribe and provide overall effectiveness only in raw JSON like {effectiveness: 50}.",
      responseKey: "response2",
      format: "json_object"
    });
    setValue(JSON.parse(effectiveness || "").effectiveness);
  };

  useEffect(() => {
    setValue(0);
    getEffectiveness();
  }, [meetingId, model]);

  return (
    <MeterGauge value={value} />
  );
};
