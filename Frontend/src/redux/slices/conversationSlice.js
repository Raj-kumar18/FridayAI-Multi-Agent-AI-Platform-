import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: [],
    selectedConversation: null
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        addConversation: (state, action) => {
            state.conversations.unshift(action.payload)
        },
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload
        },
        setConvTitle: (state, action) => {
            const { title, conversationId } = action.payload
            state.conversations = state.conversations.map((conv) => (
                conv._id == conversationId ? { ...conv, title: title } : conv
            ))

            if (state.selectedConversation?._id == conversationId) {
                state.selectedConversation = { ...state.selectedConversation, title: title }
            }
        }
    }
})

export const { setConversations, addConversation, setSelectedConversation, setConvTitle } = conversationSlice.actions
export default conversationSlice.reducer