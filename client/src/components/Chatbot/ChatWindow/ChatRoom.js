import React, { useEffect } from "react";
import './ChatRoom.scss'
import ChatBox from "./ChatBox";

function detectURL(message) {
	var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
	return message.replace(urlRegex, function(urlMatch) {
		return '<a href="' + urlMatch + '">' + urlMatch + '</a>';
	})
}

/* ========== */
/* ChatRoom component - composed of multiple ChatBoxes */
class ChatRoom extends React.Component {

	initial_msg_yesbtn = (sender, senderAvatar) => {
		let newMessageItem = {
			id: this.state.messages.length + 1,
			sender: sender,
			senderAvatar: senderAvatar,
			message: "Yes"
		};
		let messages = [...this.state.messages]
		messages.pop()
		this.typing("Something");
		//this.resetTyping(this.ownerInput.value);

		this.setState({ messages: [...messages, newMessageItem] });
		this.resetTyping(sender);
	}

	initial_msg_nobtn = (sender, senderAvatar) => {
		let newMessageItem = {
			id: this.state.messages.length + 1,
			sender: sender,
			senderAvatar: senderAvatar,
			message: "No"
		};
		let messages = [...this.state.messages]
		messages.pop()
		this.setState({ messages: [...messages, newMessageItem] });
		this.resetTyping(sender);
	}
	componentDidMount(){
		if (this.state.current_initial_message<this.state.intitial_messages.length){
			let initial_messages = [...this.state.intitial_messages]
			let messages = [...this.state.messages]
			messages.push(initial_messages[this.state.current_initial_message]);
			this.setState({ messages: [...messages], current_initial_message:this.state.current_initial_message+1 });
		}
	}
	addNewInitialMessage = () => {
		if (this.state.current_initial_message<this.state.intitial_messages.length){
			let initial_messages = [...this.state.intitial_messages]
			let messages = [...this.state.messages]
			messages.push(initial_messages[this.state.current_initial_message]);
			this.setState({ messages: [...messages], current_initial_message:this.state.current_initial_message+1 });
		}
	}
	constructor(props, context) {
		super(props);
		this.state = {
			current_initial_message: 0,
			intitial_messages: [
				{
					id: 1,
					sender: 'Recruiter',
					senderAvatar: 'https://i.pravatar.cc/150?img=56',
					message: 'Hello there, my name is Huy - a volunteer recruiter for Người Thông Dịch. Thank you for expressing interest in being a part of The Interpreter team!',
					time: new Date()
				},
				{
					id: 2,
					sender: 'Recruiter',
					senderAvatar: 'https://i.pravatar.cc/150?img=56',
					message: 'To get started, are you trying to resume an application that you have started within the past 30 days?',
					time: new Date()
				},
				{
					id: 3,
					sender: 'Recruiter',
					senderAvatar: 'https://i.pravatar.cc/150?img=56',
					message: '',
					time: new Date(),
					options: [
						{
							display_name: "Yes",
							slug: "initial_msg_yesbtn",
							action: this.initial_msg_yesbtn
						},
						{
							display_name: "No",
							slug: "initial_msg_yesbtn",
							action: this.initial_msg_nobtn
						}
					]
				},
			],
			messages: [],
			isTyping: [],
		};
		this.sendMessage = this.sendMessage.bind(this);
		this.typing = this.typing.bind(this);
		this.resetTyping = this.resetTyping.bind(this);
	}
	/* adds a new message to the chatroom */
	sendMessage(sender, senderAvatar, message) {
		setTimeout(() => {
			let messageFormat = detectURL(message);
			let newMessageItem = {
				id: this.state.messages.length + 1,
				sender: sender,
				senderAvatar: senderAvatar,
				message: messageFormat
			};
			this.setState({ messages: [...this.state.messages, newMessageItem] });
			this.resetTyping(sender);
		}, 400);
	}
	/* updates the writing indicator if not already displayed */
	typing(writer) {
		if( !this.state.isTyping[writer] ) {
			let stateTyping = this.state.isTyping;
			stateTyping[writer] = true;
			this.setState({ isTyping: stateTyping });
		}
	}
	/* hide the writing indicator */
	resetTyping(writer) {
		let stateTyping = this.state.isTyping;
		stateTyping[writer] = false;
		this.setState({ isTyping: stateTyping });
	}
	render() {
		let users = {};
		let chatBoxes = [];
		let messages = this.state.messages;
		let isTyping = this.state.isTyping;
		let sendMessage = this.sendMessage;
		let typing = this.typing;
		let resetTyping = this.resetTyping;

		/* user details - can add as many users as desired */
		users[0] = { name: 'NtdBot', avatar: 'https://i.pravatar.cc/150?img=32' };
		
		
		/* creation of a chatbox for each user present in the chatroom */
        var user = users[0];
        chatBoxes.push(
            <ChatBox
                key={0}
                owner={user.name}
                ownerAvatar={user.avatar}
                sendMessage={sendMessage}
                typing={typing}
                resetTyping={resetTyping}
                messages={messages}
                isTyping={isTyping}
				addNewInitialMessage = {this.addNewInitialMessage}
            />
        );
		return (
			<div className={"chatApp__room"}>
				{chatBoxes}
			</div>
		);
	}
}
/* end ChatRoom component */
/* ========== */
export default ChatRoom;
