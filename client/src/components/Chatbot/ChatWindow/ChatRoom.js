import React from "react";
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
		let messageReply = {
			id: this.state.messages.length + 1,
			sender: this.state.initial_messages[0].sender,
			senderAvatar: this.state.initial_messages[0].senderAvatar,
			message: "I'm working on next steps, see you tomorrow"
		};
		this.setNewUserMessage(newMessageItem);
		setTimeout(() => this.setNewRecruiterMessage(messageReply),2000);
		this.resetTyping(sender);
	}

	initial_msg_nobtn = (sender, senderAvatar) => {
		let newMessageItem = {
			id: this.state.messages.length + 1,
			sender: sender,
			senderAvatar: senderAvatar,
			message: "No"
		};
		let messageReply = {
			id: this.state.messages.length + 1,
			sender: this.state.initial_messages[0].sender,
			senderAvatar: this.state.initial_messages[0].senderAvatar,
			message: "I'm working on next steps, see you tomorrow"
		};
		this.setNewUserMessage(newMessageItem);
		setTimeout(() => this.setNewRecruiterMessage(messageReply),2000);
		this.resetTyping(sender);
	}
	setNewRecruiterMessage = (newMessageItem) => {		
		this.setState({
			current_message: newMessageItem
		})
	}
	setNewUserMessage = (newMessageItem) => {
		let messages = [...this.state.messages]
		if(this.state.current_message && this.state.current_message.hasOwnProperty('id'))
			messages.push(this.state.current_message);
		this.setState({ messages: [...messages, newMessageItem], current_message: null });
	}
	setNewInitialMessage = () => {
		let messages = [...this.state.messages]
		if(this.state.current_message && this.state.current_message.hasOwnProperty('id'))
			messages.push(this.state.current_message);
		
		let currentInitialMessageIdx = this.state.current_initial_message;
		if(currentInitialMessageIdx<this.state.initial_messages.length){
			this.setState({
				messages: messages,
				current_message: this.state.initial_messages[currentInitialMessageIdx],
				current_initial_message:currentInitialMessageIdx+1
			})
		}
	}
	componentDidMount(){
		this.setNewInitialMessage()
		this.addTimeMessageInterval = setInterval(this.setNewInitialMessage, 4000);
	}
	componentWillUnmount() {
		clearInterval(this.addTimeMessageInterval);
	}
	addNewInitialMessage = () => {
		if (this.state.current_initial_message<this.state.initial_messages.length){
			let initial_messages = [...this.state.initial_messages]
			this.setState({ 
				messages: [...this.state.messages,initial_messages[this.state.current_initial_message]],
				current_initial_message:this.state.current_initial_message+1 
			});
		}
	}
	constructor(props, context) {
		super(props);
		this.state = {
			current_initial_message: 0,
			initial_messages: [
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
					],
					requireInput: false
				},
				// {
				// 	id: 3,
				// 	sender: 'Recruiter',
				// 	senderAvatar: 'https://i.pravatar.cc/150?img=56',
				// 	message: '',
				// 	time: new Date(),
				// 	options: [
				// 		{
				// 			display_name: "Yes",
				// 			slug: "initial_msg_yesbtn",
				// 			action: this.initial_msg_yesbtn
				// 		},
				// 		{
				// 			display_name: "No",
				// 			slug: "initial_msg_yesbtn",
				// 			action: this.initial_msg_nobtn
				// 		}
				// 	]
				// },
			],
			current_message: {},
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
		users[0] = { name: 'User', avatar: 'https://i.pravatar.cc/150?img=32' };
		
		
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
				current_message = {this.state.current_message}
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
