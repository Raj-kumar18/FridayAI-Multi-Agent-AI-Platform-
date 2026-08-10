import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../redux/slices/messageSlice";
import getMessage from "../features/getMessage";
function ChatArea() {
    const dispatch = useDispatch()
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)

    useEffect(() => {
        const fetchMessage = async () => {
            const { data } = await getMessage(selectedConversation._id)
            dispatch(setMessage(data.data))
        }
        if (selectedConversation) {
            fetchMessage()
        }
    }, [selectedConversation])

    return (
        <div className="flex-1 flex flex-col h-full p-4 overflow-y-auto scrollbar-hide">
            <Nav />
            <MessageList messages={messages} />
            <ChatInput />
        </div>
    )
}

export default ChatArea
