// ** React Imports
import { Fragment, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/apps/chat/SendMsgForm'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Types
import { ChatContentType, MessageType } from 'src/types/apps/chatTypes'
import { CircularProgress } from '@mui/material'
import { chatApi } from 'src/@core/apis'

// ** Styled Components
const ChatWrapperStartChat = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  borderRadius: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover
}))

const ChatContent = (props: ChatContentType) => {
  // ** Props
  const {
    user,
    hidden,
    mdAbove,
    dispatch,
    statusObj,
    getInitials,
    sidebarWidth,
    selectedChat,
    userProfileRightOpen,
    handleLeftSidebarToggle,
    handleUserProfileRightSidebarToggle
  } = props

  const [page, setPage] = useState<number>(1)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true)

  useEffect(() => {
    if (selectedChat) {
      setMessages(() => [])
      setPage(() => 1)

      getChatContent(selectedChat._id, null)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  const getChatContent = useCallback((id: string, page: number | null) => {
    setLoadingMessages(true)
    chatApi
      .getChatContent(id, page)
      .then(({ data }) => {
        if (data.isSuccess && data.data?.chat?.messages) {
          setMessages(prev => [...prev, ...data.data.chat.messages])
          setPage(data.data.chat.page - 1)
          setHasMore(data.data.chat.hasMore)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoadingMessages(false)
      })
  }, [])

  const handleStartConversation = () => {
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const renderContent = () => {
    if (!selectedChat) {
      return (
        <ChatWrapperStartChat
          sx={{
            ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
          }}
        >
          <MuiAvatar
            sx={{
              mb: 6,
              pt: 8,
              pb: 7,
              px: 7.5,
              width: 110,
              height: 110,
              boxShadow: 3,
              backgroundColor: 'background.paper'
            }}
          >
            <Icon icon='tabler:message' fontSize='3.125rem' />
          </MuiAvatar>
          <Box
            onClick={handleStartConversation}
            sx={{
              py: 2,
              px: 6,
              boxShadow: 3,
              borderRadius: 5,
              backgroundColor: 'background.paper',
              cursor: mdAbove ? 'default' : 'pointer'
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: '1.125rem', lineHeight: 'normal' }}>
              Start Conversation
            </Typography>
          </Box>
        </ChatWrapperStartChat>
      )
    } else {
      return (
        <Box
          sx={{
            width: 0,
            flexGrow: 1,
            height: '100%',
            backgroundColor: 'action.hover'
          }}
        >
          <Box
            sx={{
              px: 5,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'background.paper',
              borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {mdAbove ? null : (
                <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
                  <Icon icon='tabler:menu-2' />
                </IconButton>
              )}
              <Box
                onClick={handleUserProfileRightSidebarToggle}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <Badge
                  overlap='circular'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  sx={{ mr: 3 }}
                  badgeContent={
                    <Box
                      component='span'
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        color: `${statusObj['online']}.main`,
                        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                        backgroundColor: `${statusObj['online']}.main`
                      }}
                    />
                  }
                >
                  {selectedChat?.user ? (
                    <MuiAvatar
                      sx={{ width: 38, height: 38 }}
                      src={selectedChat.user.picture || ''}
                      alt={`${selectedChat.user.firstName}`}
                    />
                  ) : (
                    <CustomAvatar
                      skin='light'
                      color={'success'}
                      sx={{ width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
                    >
                      {getInitials(`${selectedChat.user.lastName} ${selectedChat.user.firstName}`)}
                    </CustomAvatar>
                  )}
                </Badge>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h6'>{`${selectedChat.user.lastName} ${selectedChat.user.firstName}`}</Typography>
                  <Typography sx={{ color: 'text.disabled' }}>{selectedChat.user.role}</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {mdAbove ? (
                <Fragment>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:phone-call' />
                  </IconButton>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:video' />
                  </IconButton>
                  <IconButton size='small' sx={{ color: 'text.secondary' }}>
                    <Icon icon='tabler:search' />
                  </IconButton>
                </Fragment>
              ) : null}

              <OptionsMenu
                menuProps={{ sx: { mt: 2 } }}
                icon={<Icon icon='tabler:dots-vertical' />}
                iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
                options={['View Contact', 'Mute Notifications', 'Block Contact', 'Clear Chat', 'Report']}
              />
            </Box>
          </Box>

          {selectedChat && !loadingMessages ? (
            <>
              <ChatLog
                hidden={hidden}
                selectedChat={selectedChat}
                page={page}
                messages={messages}
                hasMore={hasMore}
                getChatContent={getChatContent}
              />
              <SendMsgForm selectedChat={selectedChat} setMessages={setMessages} />
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <CircularProgress />
            </div>
          )}

          {/* <UserProfileRight
            store={store}
            hidden={hidden}
            statusObj={statusObj}
            getInitials={getInitials}
            sidebarWidth={sidebarWidth}
            userProfileRightOpen={userProfileRightOpen}
            handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
          /> */}
        </Box>
      )
    }
  }

  return renderContent()
}

export default ChatContent
