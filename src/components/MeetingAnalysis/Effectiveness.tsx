//@ts-nocheck

import React, { useEffect, useState } from "react";

import { askModel } from "@/utils/apiUtils";
import { MeterGauge } from "../shared/MeterGauge";


export const MeetingEffectiveness = ({ meetingId }: { meetingId: number }) => {
  const [value, setValue] = useState(0);
  const getEffectiveness = async () => {
    const effectiveness = await askModel(
      meetingId,
      "Can you analyse meeting transcribe and provide overall effectiveness only in raw JSON like {effectiveness: 50}.",
      "response2"
    );
    setValue(JSON.parse(effectiveness || "").effectiveness);
  };

  useEffect(() => {
    getEffectiveness();
  }, [meetingId]);

  return (
    <MeterGauge value={value} />
  );
};
