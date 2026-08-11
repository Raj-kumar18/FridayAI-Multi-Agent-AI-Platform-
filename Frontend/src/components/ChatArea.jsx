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
        <div className="flex min-h-full items-center justify-center text-center flex-1 flex-col w-full">
            <Nav />
            <MessageList />
            <ChatInput />
        </div>
    )
}

export default ChatArea
