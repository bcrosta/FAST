import React from 'react'
import Header from '../Header/header'
import MessageSidebar from './MessageSidebar/message_sidebar'
import './messages.css'


const messageid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const fromSender = [true, false, false, true, true, false, true, false, true, false]
const messages = ["Hello?","Hello!","Are you still interested in purchasing this banana?", "Yes I am.", "Where can we meet up?",
"How about we meet up in front of Geisel at 10 AM tomorrow?", "I can't make 10 AM, can you do 11 AM instead?", "Sure, that's fine!",
"Great, see you then!", "Yep, see you!"];
const timestamps = ["3:02:21 PM", "3:02:28 PM", "3:02:48 PM", "3:03:12 PM", "3:03:16 PM", "3:03:44 PM", "3:05:10 PM", "3:05:25 PM",
"3:05:31 PM", "3:05:34 PM"];
const recipient = "John";
const user = "You";
const getMessages = messageid.map((id) =>
  <div>
    {(fromSender[id]) ? (<div className="messages-sent">{user} [{timestamps[id]}]: {messages[id]}</div>) : (<div className="messages-received">{recipient} [{timestamps[id]}]: {messages[id]}</div>)}
  </div>
);

const Messages = () => (
  <div className="messages">
    <Header />
    <div className="messages-content">
    <MessageSidebar />
      <div className="messages-messenger">
        <div className="messages-messages">
          {getMessages}
        </div>
        <div className="messages-messenger-container">
          <input className="messages-messenger-input"></input>
          <button className="messages-messenger-sender">Send</button>
        </div>
      </div>
    </div>
  </div>
)

export default Messages