import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import conversationReducer from "./slices/conversationSlice"
import messageReducer from "./slices/messageSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        conversation: conversationReducer,
        message: messageReducer,
    },
})