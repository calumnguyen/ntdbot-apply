import React from 'react'

const ChatTitle = (props) =>  {
	return (
		<div className={"chatApp__convTitle"}>{props.owner}'s display</div>
	);
}

export default ChatTitle;