import React from "react";
import ImageBox from "./ImageBox";


import moment from "moment";
import { TimeFormatForChatBot } from "../../../utils/constants";

/* ========== */
/* InputMessage component - used to type the message */

class InputMessage extends React.Component {
  constructor(props, context) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
  }
  handleSendMessage(event) {
    event.preventDefault();
    /* Disable sendMessage if the message is empty */
    if (this.messageInput.value.length > 0) {
      this.props.sendMessageLoading(
        this.ownerInput.value,
        this.ownerAvatarInput.value,
        this.messageInput.value
      );
      /* Reset input after send*/
      this.messageInput.value = "";
    }
  }
  handleTyping(event) {
    /* Tell users when another user has at least started to write */
    if (this.messageInput.value.length > 0) {
      this.props.typing(this.ownerInput.value);
    } else {
      /* When there is no more character, the user no longer writes */
      this.props.resetTyping(this.ownerInput.value);
    }
  }
  render() {
    /* If the chatbox state is loading, loading class for display */
    var loadingClass = this.props.isLoading
      ? "chatApp__convButton--loading"
      : "";
    let sendButtonIcon = <i class="fa fa-paper-plane" aria-hidden="true" />;
    return (
      <form onSubmit={this.handleSendMessage}>
        <input
          type="hidden"
          ref={(owner) => (this.ownerInput = owner)}
          value={this.props.owner}
        />
        <input
          type="hidden"
          ref={(ownerAvatar) => (this.ownerAvatarInput = ownerAvatar)}
          value={this.props.ownerAvatar}
        />
        <input
          type="text"
          ref={(message) => (this.messageInput = message)}
          className={"chatApp__convInput"}
          placeholder="Text message"
          onKeyDown={this.handleTyping}
          onKeyUp={this.handleTyping}
          tabIndex="0"
        />
        <div
          className={"chatApp__convButton " + loadingClass}
          onClick={this.handleSendMessage}
        >
          {sendButtonIcon}
        </div>
      </form>
    );
  }
}
/* end InputMessage component */
/* ========== */

/* ========== */
/* TypingIndicator component */
class TypingIndicator extends React.Component {
  render() {
    let typersDisplay = "";
    let countTypers = 0;
    /* for each user writing messages in chatroom */
    for (var key in this.props.isTyping) {
      /* retrieve the name if it isn't the owner of the chatbox */
      if (key !== this.props.owner && this.props.isTyping[key]) {
        typersDisplay += ", " + key;
        countTypers++;
      }
    }
    /* formatting text */
    typersDisplay = typersDisplay.substr(1);
    typersDisplay += countTypers > 1 ? " are " : " is ";
    /* if at least one other person writes */
    if (countTypers > 0) {
      return (
        <div className={"chatApp__convTyping"}>
          {typersDisplay} writing
          <span className={"chatApp__convTypingDot"}></span>
        </div>
      );
    }
    return <div className={"chatApp__convTyping"}></div>;
  }
}
/* end TypingIndicator component */
/* ========== */
// Owner is the user
// Sender is the Chatbot
/* ========== */
/* MessageList component - contains all messages */
class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recruiterIsTyping: true,
    };
  }
  toggleRecruiterTypingStatus = () => {
    this.setState({ recruiterIsTyping: !this.state.recruiterIsTyping });
  };
  componentDidUpdate() {
    let objDiv = document.getElementById("chatApp__convTimeline");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  getTypingLoader = () => {
    if (this.state.recruiterIsTyping) {
      return (
        <div className="custom_typing_indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      );
    }
    return null;
  };
  render() {
    let currentMessageItem = this.props.current_message;
    return (
      <div className={"chatApp__convTimeline"} id={"chatApp__convTimeline"}>
        {this.props.messages.slice(0).map((messageItem) => (
          <MessageItem
            key={messageItem.id}
            owner={this.props.owner}
            ownerAvatar={this.props.ownerAvatar}
            sender={messageItem.sender}
            senderAvatar={messageItem.senderAvatar}
            message={messageItem.message}
            options={messageItem.options}
            currentMessage={false}
          />
        ))}
        {currentMessageItem && currentMessageItem.hasOwnProperty("id") && (
          <MessageItem
            key={currentMessageItem.id}
            owner={this.props.owner}
            ownerAvatar={this.props.ownerAvatar}
            sender={currentMessageItem.sender}
            senderAvatar={currentMessageItem.senderAvatar}
            message={currentMessageItem.message}
            options={currentMessageItem.options}
            currentMessage={true}
          />
        )}
      </div>
    );
  }
}
/* end MessageList component */
/* ========== */

/* ========== */
/* MessageItem component - composed of a message and the sender's avatar */
class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recruiterIsTyping: true,
    };
  }
  toggleRecruiterTypingStatus = () => {
    this.setState({ recruiterIsTyping: !this.state.recruiterIsTyping });
  };
  getMessageForRecruiter = (message) => {
    if (this.state.recruiterIsTyping && this.props.currentMessage) {
      setTimeout(this.toggleRecruiterTypingStatus, 2000);
      return (
        <div className="custom_typing_indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="chatApp__convMessageValue" dangerouslySetInnerHTML={{ __html: this.props.message }}/>
        {/* <span className="timeSpan">{moment(this.props.message.time).format(TimeFormatForChatBot)}</span> */}
        </>
      );
    }
  };
  getOptionsBtn = () => {
    let optionsBtn = [];
    this.props.options.forEach((item, idx) => {
      optionsBtn.push(
        <button
          className="btn btn-primary option_btn"
          onClick={() => item.action(this.props.owner, this.props.ownerAvatar)}
        >
          {item.display_name}
        </button>
      );
    });
    return optionsBtn;
  };
  getMessageAndOptionsForRecruiter = () => {
    if (this.state.recruiterIsTyping && this.props.currentMessage) {
      setTimeout(this.toggleRecruiterTypingStatus, 2000);
      return (
        <div className="custom_typing_indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="messageAndOptionsDiv">
          <div
            className="chatApp__convMessageValue"
            dangerouslySetInnerHTML={{ __html: this.props.message }}
          />
          <div className="option_btn_div">{this.getOptionsBtn()}</div>
        </div>
      );
    }
  };
  getOnlyOptionsForRecruiter = () => {
    if (this.state.recruiterIsTyping && this.props.currentMessage) {
      setTimeout(this.toggleRecruiterTypingStatus, 2000);
      return (
        <div className="custom_typing_indicator">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      );
    } else {
      return <div className="option_btn_div">{this.getOptionsBtn()}</div>;
    }
  };
  getMessageFromRecruiter = () => {
    if (this.props.message?.length > 0 && this.props.options?.length > 0) {
      //show both
      return (
        <div>
          <ImageBox
            src={this.props.senderAvatar}
            alt={this.props.sender}
            isAvailable={true}
          />

          {this.props.sender === "Recruiter" ? (
            this.getMessageAndOptionsForRecruiter()
          ) : (
            <>
              <div
                className="chatApp__convMessageValue"
                dangerouslySetInnerHTML={{ __html: this.props.message }}
              ></div>
              {/* Show options also here */}
              <div className="option_btn_div">{this.getOptionsBtn()}</div>
            </>
          )}
        </div>
      );
    } else if (this.props.options?.length > 0) {
      return (
        <div>
          {/* Show options also here */}
          {this.props.sender === "Recruiter" ? (
            this.getOnlyOptionsForRecruiter(this.props.message)
          ) : (
            <div className="option_btn_div">{this.getOptionsBtn()}</div>
          )}
        </div>
      );
    } else {
      return (
        <>
          <ImageBox
            src={this.props.senderAvatar}
            alt={this.props.sender}
            isAvailable={true}
          />
          {this.props.sender === "Recruiter" ? (
            this.getMessageForRecruiter(this.props.message)
          ) : (
            <div
              className="chatApp__convMessageValue"
              dangerouslySetInnerHTML={{ __html: this.props.message }}
            ></div>
          )}
        </>
      );
    }
  };
  render() {
    /* message position formatting - right if I'm the author */
    let messagePosition =
      this.props.owner === this.props.sender
        ? "chatApp__convMessageItem--right"
        : "chatApp__convMessageItem--left";
    return (
      <div
        className={"chatApp__convMessageItem " + messagePosition + " clearfix"}
      >
        {this.getMessageFromRecruiter()}
      </div>
    );
  }
}

/* ========== */
/* ChatBox component - composed of Title, MessageList, TypingIndicator, InputMessage */
/* end ChatBox component */
/* ========== */

class ChatBox extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.sendMessageLoading = this.sendMessageLoading.bind(this);
  }
  /* catch the sendMessage signal and update the loading state then continues the sending instruction */
  sendMessageLoading(sender, senderAvatar, message) {
    this.setState({ isLoading: true });
    this.props.sendMessage(sender, senderAvatar, message);
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 400);
  }
  render() {
    return (
      <div className={"chatApp__conv"}>
        <MessageList
          owner={this.props.owner}
          messages={this.props.messages}
          ownerAvatar={this.props.ownerAvatar}
          current_message={this.props.current_message}
        />
        <div className={"chatApp__convSendMessage clearfix"}>
          <TypingIndicator
            owner={this.props.owner}
            isTyping={this.props.isTyping}
          />
          {this.props.current_message &&
            this.props.current_message.hasOwnProperty("id") &&
            this.props.current_message?.requireInput && (
              <InputMessage
                isLoading={this.state.isLoading}
                owner={this.props.owner}
                ownerAvatar={this.props.ownerAvatar}
                sendMessage={this.props.sendMessage}
                sendMessageLoading={this.sendMessageLoading}
                typing={this.props.typing}
                resetTyping={this.props.resetTyping}
              />
            )}
        </div>
      </div>
    );
  }
}

export default ChatBox;
