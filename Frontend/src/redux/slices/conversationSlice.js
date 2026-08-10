import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: []
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
        }
    }
})

export const { setConversations, addConversation } = conversationSlice.actions
export default conversationSlice.reducer