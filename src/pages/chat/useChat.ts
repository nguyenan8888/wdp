import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { chatApi } from 'src/@core/apis'
import { RootState } from 'src/store'
import { initChat } from 'src/store/apps/chat'
import { ChatType } from 'src/types/apps/chatTypes'

const useChat = () => {
  const store = useSelector((state: RootState) => state.chat)
  const dispatch = useDispatch()

  // ** States
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null)

  useEffect(() => {
    getChats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getChats = () => {
    chatApi.getChats({ limit: 10, offset: 0 }).then(({ data }) => {
      if (data.isSuccess) {
        dispatch(initChat({ chats: data.data.chats }))
      }
    })
  }

  return {
    chats: store.chats,
    chatsGroup: store.chatsGroup,
    selectedChat,
    setSelectedChat
  }
}

export default useChat
