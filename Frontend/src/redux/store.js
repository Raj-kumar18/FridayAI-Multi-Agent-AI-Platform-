import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import conversationReducer from "./slices/conversationSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        conversation: conversationReducer
    },
})