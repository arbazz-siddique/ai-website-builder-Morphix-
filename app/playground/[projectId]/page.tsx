"use client";
import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type Messages = {
  role: string;
  content: string;
};

function PlayGround() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetail, setFrameDetail] = useState<Frame>();

  useEffect(() => {
    getFrameDetails();
  }, [frameId]);

  const getFrameDetails = async () => {
    const result = await axios.get(
      "/api/frames?frameId=" + frameId + "&projectId=" + projectId
    );
    console.log(result);
    setFrameDetail(result.data);
  };

  const sendMessage=(userInput:string)=>{
    
  }

  return (
    <div>
      <PlaygroundHeader />

      <div className="flex">
        {/* chat section */}
        <ChatSection messages={frameDetail?.chatMessages ?? []} onSend={(input:string)=> sendMessage(input)} />
        {/* website design */}
        <WebsiteDesign />

        {/* settings */}
        {/* <ElementSettingSection/> */}
      </div>
    </div>
  );
}

export default PlayGround;
