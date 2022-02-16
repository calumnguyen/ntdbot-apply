import React from 'react'
import moment from 'moment'
import { DateFormatWithName } from '../../utils/constants';
import ChatWindow from './ChatRoom';
function Chatbot() {
  return (
    <div>
        {/* <img src="/assets/img/logo.png"/> */}
        <p>Huy Recruiter</p>
        <p>Available to help you start your application</p>
        <p>{moment(new Date()).format(DateFormatWithName)}</p>
        <ChatWindow/>
    </div>
  )
}

export default Chatbot