// ** React
import { useEffect, useMemo, useState } from 'react'

// ** Muis
import { Box, Menu, MenuItem, MenuProps, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import toast from 'react-hot-toast'

// ** Types
import { ChatType, MessageType } from 'src/types/apps/chatTypes'

// ** Custom Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSocket } from 'src/hooks/useSocket'

// ** Icons
import { Icon } from '@iconify/react'

// ** Custom components
import ReactLike from 'src/@core/components/reacts/ReactLike'
import ReactHeart from 'src/@core/components/reacts/ReactHeart'
import ReactHaHa from 'src/@core/components/reacts/ReactHaHa'
import ReactWow from 'src/@core/components/reacts/ReactWow'
import ReactSad from 'src/@core/components/reacts/ReactSad'
import ReactAngry from 'src/@core/components/reacts/ReactAngry'

// ** Constants
import { REACT_ACTIONS } from 'src/@core/constants'

// ** APIs
import { chatApi } from 'src/@core/apis'

const reactsObjectComponent: { [emote: string]: React.ReactElement } = {
  LIKE: <ReactLike size={12} key={1} />,
  LOVE: <ReactHeart size={14} key={2} />,
  HAHA: <ReactHaHa size={12} key={3} />,
  WOW: <ReactWow size={12} key={4} />,
  SAD: <ReactSad size={12} key={5} />,
  ANGRY: <ReactAngry size={12} key={6} />
}

const isUserReact = (reacts: { [emote: string]: string }, userId: string, action: string) => {
  return reacts[userId] === action
}

type MessageTypeProps = {
  message: MessageType
  isSender: boolean
  index: number
  selectedChat: ChatType
  time: Date
  length: number
}

const MenuReacts = styled(Menu)<MenuProps>(({ theme }) => {
  return {
    '& .MuiMenu-list': {
      display: 'flex',
      padding: '4px',
      '& .MuiMenuItem-root': {
        margin: 0,
        padding: '6px 12px'
      },
      '& .MuiMenuItem-root:hover': {
        '& svg': {
          transform: 'translateY(-3px)',
          transition: 'transform ease .2s',
          fontSize: 'calc(100% + 12px)'
        }
      },
      '& .active': {
        backgroundColor: 'rgba(204, 204, 204, 0.3)',
        '& svg': {
          fontSize: 'calc(100% + 12px)'
        }
      }
    }
  }
})

const Message = (props: MessageTypeProps) => {
  const { isSender, index, selectedChat, time, message, length } = props

  // ** Hooks
  const { user } = useAuth()
  const { socket } = useSocket()
  const theme = useTheme()

  // ** States
  const [openReacts, setOpenReacts] = useState<null | HTMLElement>(null)
  const [currentMessage, setCurrentMessage] = useState<MessageType>(message)

  useEffect(() => {
    const handleUpdateReact = (payload: { isSuccess: boolean; reacts: { [id: string]: string } }) => {
      const { reacts } = payload

      setCurrentMessage(prev => ({ ...prev, reacts }))
    }

    socket?.on(`response-react-message-${currentMessage._id}`, handleUpdateReact)

    return () => {
      socket?.off(`response-react-message-${currentMessage._id}`, handleUpdateReact)
    }
  }, [socket, currentMessage._id])

  const reacts = useMemo(() => {
    const reactsArray = Object.values(currentMessage.reacts)

    const emotes: { [emote: string]: number } = {}
    reactsArray.forEach(react => {
      if (emotes[react]) {
        emotes[react] = emotes[react] + 1
      } else emotes[react] = 1
    })

    return emotes
  }, [currentMessage.reacts])

  const renderReacts = (reacts: { [emote: string]: number }) => {
    return (
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: 'background.paper',
          boxShadow: `0px 0px 10px -2px ${theme.palette[isSender ? 'secondary' : 'primary'][theme.palette.mode]}`,
          bottom: '-8px',
          right: isSender ? '4px' : 'unset',
          left: isSender ? 'unset' : '4px',
          height: '18px',
          padding: '0 4px',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '.8rem',
          gap: 1
        }}
      >
        {Object.keys(reacts).map(react => reactsObjectComponent[react])}
        <span style={{ margin: '0 .25rem' }}>1</span>
      </Box>
    )
  }

  const handleCloseReacts = () => {
    setOpenReacts(null)
  }

  const handleReactMessage = (action: string) => {
    setOpenReacts(null)
    const payload = {
      chatId: selectedChat._id,
      action,
      messageId: currentMessage._id
    }

    chatApi
      .reactMessage(payload)
      .then(({ data }) => {
        if (data.isSuccess) {
          socket &&
            socket.emit('react-message', {
              chatId: selectedChat._id,
              message: data.data.message
            })
          setCurrentMessage(data.data.message)
        } else toast.error(data?.message)
      })
      .catch(err => toast.error(err?.message))
  }

  return (
    <Box className='message-item' sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: isSender ? 'row-reverse' : 'row' }}>
        <Box sx={{ maxWidth: '80%', position: 'relative' }}>
          <Typography
            sx={{
              boxShadow: 1,
              borderRadius: 1,
              maxWidth: '100%',
              width: 'fit-content',
              wordWrap: 'break-word',
              p: theme => theme.spacing(2.25, 4),
              ml: isSender ? 'auto' : undefined,
              borderTopLeftRadius: !isSender ? 0 : undefined,
              borderTopRightRadius: isSender ? 0 : undefined,
              color: isSender ? 'common.white' : 'text.primary',
              backgroundColor: isSender ? 'primary.main' : 'background.paper'
            }}
          >
            {currentMessage.content}
          </Typography>
          {Object.keys(reacts).length > 0 && renderReacts(reacts)}
        </Box>
        {!isSender && (
          <div className='message-action' style={Boolean(openReacts) ? { display: 'flex' } : {}}>
            <div className='pointer' aria-controls='react-action' onClick={e => setOpenReacts(e.currentTarget)}>
              <Icon icon='uil:smile' fontSize={18} />
            </div>
            <div className='pointer'>
              <Icon icon='material-symbols:reply' fontSize={18} />
            </div>
            <div className='pointer'>
              <Icon icon='ri:more-line' fontSize={18} />
            </div>
          </div>
        )}
      </div>
      {index + 1 === length ? (
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSender ? 'flex-end' : 'flex-start'
          }}
        >
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {time
              ? new Date(time).toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })
              : null}
          </Typography>
        </Box>
      ) : null}

      {/* Reacts */}
      <MenuReacts
        keepMounted
        id='react-action'
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorEl={openReacts}
        open={Boolean(openReacts)}
        onClose={handleCloseReacts}
      >
        <MenuItem
          className={user && isUserReact(currentMessage.reacts, user._id, REACT_ACTIONS.LIKE) ? 'active' : ''}
          onClick={() => handleReactMessage(REACT_ACTIONS.LIKE)}
        >
          <ReactLike size={24} />
        </MenuItem>
        <MenuItem
          className={user && isUserReact(currentMessage.reacts, user._id, REACT_ACTIONS.LOVE) ? 'active' : ''}
          onClick={() => handleReactMessage(REACT_ACTIONS.LOVE)}
        >
          <ReactHeart size={24} />
        </MenuItem>
        <MenuItem
          className={user && isUserReact(currentMessage.reacts, user._id, REACT_ACTIONS.HAHA) ? 'active' : ''}
          onClick={() => handleReactMessage(REACT_ACTIONS.HAHA)}
        >
          <ReactHaHa size={20} />
        </MenuItem>
        <MenuItem
          className={user && isUserReact(currentMessage.reacts, user._id, REACT_ACTIONS.WOW) ? 'active' : ''}
          onClick={() => handleReactMessage(REACT_ACTIONS.WOW)}
        >
          <ReactWow size={20} />
        </MenuItem>
        <MenuItem
          className={user && isUserReact(currentMessage.reacts, user._id, REACT_ACTIONS.SAD) ? 'active' : ''}
          onClick={() => handleReactMessage(REACT_ACTIONS.SAD)}
        >
          <ReactSad size={20} />
        </MenuItem>
        <MenuItem
          className={user && isUserReact(currentMessage.reacts, user._id, REACT_ACTIONS.ANGRY) ? 'active' : ''}
          onClick={() => handleReactMessage(REACT_ACTIONS.ANGRY)}
        >
          <ReactAngry size={20} />
        </MenuItem>
      </MenuReacts>
    </Box>
  )
}

export default Message
