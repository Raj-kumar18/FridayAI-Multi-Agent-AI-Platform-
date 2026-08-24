import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    artifacts: [],
    isLoading: false
}

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.messages = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setArtifacts: (state, action) => {
            state.artifacts = action.payload
        },
        addArtifact: (state, action) => {
            state.artifacts.push(action.payload)
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        }
    }
})

export const { setMessage, addMessage, setArtifacts, addArtifact, setIsLoading } = messageSlice.actions
export default messageSlice.reducer