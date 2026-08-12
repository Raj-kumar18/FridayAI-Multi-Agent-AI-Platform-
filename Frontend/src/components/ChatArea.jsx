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


    useEffect(() => {
        const fetchMessage = async () => {
            const { data } = await getMessage(selectedConversation._id)
            dispatch(setMessage(data))
            console.log(data)
        }
        if (selectedConversation) {
            fetchMessage()
        }
    }, [selectedConversation])

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col w-full overflow-hidden">
            <Nav />
            <MessageList />
            <ChatInput />
        </div>
    )
}

export default ChatArea
