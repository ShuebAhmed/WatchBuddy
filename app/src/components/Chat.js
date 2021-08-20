// Importing necessary libraries and tools

import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import conversationService from '../services/conversation';
import messageService from '../services/message';
import session from '../services/session';
import {
    ChatList,
    ChatItem,
    MessageList,
    Navbar,
    Avatar
} from "react-chat-elements";
import {swalError} from '../utils/swal';
import noChatSelected from '../media/no-chat-selected.png';
import 'react-chat-elements/dist/main.css';

var socket = null;
function Chat(props) {

    const [messageText, setMessageText] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket = io(process.env.REACT_APP_API_URL, {transports: ['websocket']});
        socket.emit("init", session.get('user')._id);
        socket.on('connect', () => {
            console.log("Connected to SocketIO Server.");
        });
        socket.on("message-received", () => {
            reloadConversationsAndMessages();
            scrollChat();
        });
    }, []);

    // useEffect(() => {
    //     if(session.startConversation && session.startConversation.length === 24) {
    //         setSelectedConversationId(session.startConversation);
    //         setKey(keys.startConversation, null);
    //     }
    // }, []);

    useEffect(() => {
        reloadConversations('');
    }, []);

    const reloadConversations = searchKeyword => {
        conversationService.getAll()
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                let f = [];
                let t = result.data;
                t = t.forEach(x => {
                    x.members.forEach(member => {
                        if (member._id !== session.get('user')._id) {
                            f.push({
                                conversationId: x._id,
                                avatar: `${process.env.REACT_APP_API_URL}/${member.pictureId}`,
                                alt: member.fullname,
                                title: member.fullname,
                                subtitle: x.subtitle,
                                date: new Date(x.recentDate),
                                unread: 0
                            });
                        }
                    });
                });

                if (f.length > 0 && searchKeyword && searchKeyword.length > 0)
                    f = f.filter(y => y && y.title && y.title.toLowerCase().includes(searchKeyword.toLowerCase()));

                setConversations(f);
            });
    }

    const reloadConversationsAndMessages = () => {
        conversationService.getAll()
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                let f = [];
                let t = result.data;
                t = t.forEach(x => {
                    x.members.forEach(member => {
                        if (member._id !== session.get('user')._id) {
                            f.push({
                                conversationId: x._id,
                                avatar: `${process.env.REACT_APP_API_URL}/${member.pictureId}`,
                                alt: member.fullname,
                                title: member.fullname,
                                subtitle: x.subtitle,
                                date: new Date(x.recentDate),
                                unread: 0
                            });
                        }
                    });
                });

                setConversations(f);
                reloadMessagesByConversationId(f[0].conversationId);
            });
    }

    useEffect(() => {
        reloadMessages();
    }, [selectedConversationId]);

    const reloadMessages = () => {
        if (selectedConversationId) {
            messageService.getAll(selectedConversationId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    let t = result.data;
                    t = t.map(x => {
                        return {
                            position: x.authorId === session.get('user')._id ? 'right' : 'left',
                            type: 'text',
                            text: x.body,
                            date: new Date(x.date),
                        };
                    });
                    setMessages(t);
                });
        }
    }

    const reloadMessagesByConversationId = conversationId => {
        if (conversationId) {
            messageService.getAll(conversationId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    let t = result.data;
                    t = t.map(x => {
                        return {
                            position: x.authorId === session.get('user')._id ? 'right' : 'left',
                            type: 'text',
                            text: x.body,
                            date: new Date(x.date),
                        };
                    });
                    setMessages(t);
                });
        }
    }

    const handleKeyPress = e => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    }

    const handleSendMessage = () => {
        if (!messageText || !selectedConversationId) return;

        const data = {
            conversationId: selectedConversationId,
            date: Date.now(),
            authorId: session.get('user')._id,
            body: messageText
        };

        socket.emit("new-message", data);
        reloadMessages();
        setMessageText("");
        reloadConversations();
    }

    const selectConversation = e => {
        setSelectedConversationId(e.conversationId);
        scrollChat();
    }

    const scrollChat = () => {
        setTimeout(() => {
            if(document.querySelector(`.rce-mlist`)) {
                const element = document.querySelector(`.rce-mlist`);
                element.scrollTop = element.scrollHeight - element.clientHeight;
            }

            if(document.getElementById('txt-new-message')) {
                document.getElementById('txt-new-message').focus();
            }
        }, 300);
    }

    const renderChatNavbar = () => {
        if (selectedConversationId) {
            let c = conversations.find(c => c.conversationId === selectedConversationId);
            if (c) {
                return (
                    <Navbar
                        left={
                            <div>
                                <Avatar
                                    src={c.avatar}
                                    alt={c.title}
                                    size="large"
                                    type="circle"
                                />
                                <p className="navBarText">{c.title}</p>
                            </div>
                        }

                        // right={
                        //     <div>
                        //         <button className="btn btn-secondary btn-send-offer" onClick={handleSendMessage}>Make an offer</button>
                        //     </div>
                        // }
                    />);
            }
        }
    }

    return (
        <div className="container chat">
            <div className="row mt-20">
                <div className="col-sm-4 left-side">
                    <div className="row users">
                        <ChatList
                            className='chat-list'
                            dataSource={conversations}
                            onClick={selectConversation}/>
                    </div>
                </div>
                <div className="col-sm-8 right-side">
                    <div className="row">
                        <div className="col">
                            {renderChatNavbar()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            {
                                !selectedConversationId || messages.length === 0 ?
                                    <img src={noChatSelected} className="no-chat-selected"/> :
                                    <MessageList
                                        className="message-list"
                                        lockable={true}
                                        toBottomHeight={"100%"}
                                        dataSource={messages}
                                    />
                            }
                        </div>
                    </div>

                    {
                        selectedConversationId &&
                        <div className="row">
                            <div className="col">
                                <div className="form-inline">
                                    <input
                                        type="text"
                                        className="form-control txt-new-message"
                                        placeholder="Type your message..."
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        id="txt-new-message"
                                        autoFocus
                                        style={{width: '90%'}}/>

                                    <button className="btn btn-primary btn-send" onClick={handleSendMessage}>Send</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Chat;