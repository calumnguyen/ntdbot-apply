import React from 'react'

class ChatTitle extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div className={"chatApp__convTitle"}>{this.props.owner}'s display</div>
		);
	}
}

export default ChatTitle;