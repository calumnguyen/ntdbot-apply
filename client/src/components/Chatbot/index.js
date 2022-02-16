import React from "react";
import moment from "moment";
import { DateFormatWithName } from "../../utils/constants";
import ChatRoom from "./ChatRoom";
import ImageBox from "./ImageBox";

import "./Chatbox.scss";

function Chatbot() {
  return (
    <div className="chatbox">
      <div className="chatUserImage">
        <div className="position-relative">
          <img
            src={"https://i.pravatar.cc/150?img=56"}
            alt={"NtdBot"}
            className="chatApp__convMessageAvatar"
          />
          <span className="isAvailable_yellow mainImage">
            <i className="fa fa-circle" aria-hidden="true" />
          </span>
        </div>
      </div>
      <p>Huy - Recruiter</p>
      <p className="helping_text">
        Available to help you start your application
      </p>
      <p>{moment(new Date()).format(DateFormatWithName)}</p>
      <ChatRoom />
    </div>
  );
}

export default Chatbot;
