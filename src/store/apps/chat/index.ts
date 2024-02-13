// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: [],
    chatsGroup: []
  },
  reducers: {
    initChat: (state, payload) => {
      state.chats = payload.payload.chats
    }
  }
})

export const { initChat } = appChatSlice.actions

export default appChatSlice.reducer
