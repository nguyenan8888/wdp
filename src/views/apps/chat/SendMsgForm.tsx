// ** React Imports
import { useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { MessageType, SendMsgComponentType } from 'src/types/apps/chatTypes'
import { useSocket } from 'src/hooks/useSocket'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

const SendMsgForm = (props: SendMsgComponentType) => {
  // ** Props
  const { selectedChat, setMessages } = props
  const { socket } = useSocket()

  // ** State
  const [msg, setMsg] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    if (socket && selectedChat) {
      const handleResponse = (data: { message: MessageType }) => {
        const { message } = data

        console.log(data.message)

        if (message) {
          setMessages(prev => [message, ...prev])
          setMsg('')
          socket.emit('typing-message', { action: 'OFF_TYPING', chatId: selectedChat._id })
        }
      }

      socket?.on(`response-send-message`, handleResponse)

      return () => {
        socket.off(`response-send-message`, handleResponse)
      }
    }
  }, [socket, setMessages, selectedChat])

  useEffect(() => {
    if (isTyping && socket) {
      socket.emit('typing-message', { action: 'ON_TYPING', chatId: selectedChat._id })
    }

    return () => {
      if (isTyping && socket) socket.emit('typing-message', { action: 'OFF_TYPING', chatId: selectedChat._id })
    }
  }, [isTyping, socket, selectedChat])

  const handleSubmitForm = (e: SyntheticEvent) => {
    e.preventDefault()
    const msgSend = msg.trim()
    if (msgSend === '') return

    const payload = {
      chatId: selectedChat._id,
      message: msgSend,
      targetUserId: selectedChat.user._id
    }

    socket?.emit('send-message', payload)
  }

  return (
    <Form onSubmit={handleSubmitForm}>
      <ChatFormWrapper>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            fullWidth
            value={msg}
            placeholder='Type your message here…'
            onChange={e => {
              const value = e.target.value.trim()

              setMsg(e.target.value)
              setIsTyping(!!value)
            }}
            sx={{
              '& .Mui-focused': { boxShadow: 'none !important' },
              '& .MuiInputBase-input:not(textarea).MuiInputBase-inputSizeSmall': {
                p: theme => theme.spacing(1.875, 2.5)
              },
              '& .MuiInputBase-root': { border: '0 !important' }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' sx={{ color: 'text.primary' }}>
            <Icon icon='tabler:microphone' />
          </IconButton>
          <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 3, color: 'text.primary' }}>
            <Icon icon='tabler:photo' />
            <input hidden type='file' id='upload-img' />
          </IconButton>
          <Button type='submit' variant='contained'>
            Send
          </Button>
        </Box>
      </ChatFormWrapper>
    </Form>
  )
}

export default SendMsgForm
