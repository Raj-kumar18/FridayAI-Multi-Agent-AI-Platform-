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
        }
    }
})

export const { setConversations, addConversation, setSelectedConversation } = conversationSlice.actions
export default conversationSlice.reducer