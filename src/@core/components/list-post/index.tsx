/* eslint-disable lines-around-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

// ** Next Import
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import DialogReport from './DialogReport'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import SwiperControls from 'src/views/components/swiper/SwiperControls'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import ListItemButton from '@mui/material/ListItemButton'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { Breakpoint } from '@mui/system'
import { useSettings } from 'src/@core/hooks/useSettings'
import { postApi } from 'src/@core/apis'
import { DialogContentText } from '@mui/material'
import PostDetails from './[id]/PostDetails'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useSocket } from 'src/hooks/useSocket'
import { useAuth } from 'src/hooks/useAuth'

interface ListPost {
  listData: any,
}

const ListPost = (props: ListPost) => {
  const router = useRouter()
  const { listData } = props
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = useState<boolean>(false)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
  const [isLiked, setIsLiked] = useState(false)
  const [showHeart, setShowHeart] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (!showHeart) {
      setShowHeart(true);
      setTimeout(() => {
        setShowHeart(false);
      }, 1000);
    }
  }

  // const openCommentDialog = () => {
  //   return ()
  // }
  // ** Hook
  const {
    settings: { direction }
  } = useSettings()


  //post details
  const [openPostDetails, setOpenPostDetails] = useState(false)
  const handleClickOpenPostDetails = () => setOpenPostDetails(true)
  const handleClosePostDetails = () => setOpenPostDetails(false)

  const [postDetail, setPostDetail] = useState(null);
  const handlePostDetails = (postId: string) => {
    console.log(postId);


    postApi.get_postDetails(postId)
      .then(response => {
        setPostDetail(response.data);
        setOpenPostDetails(true);

      })
      .catch(error => {
        console.error('Error fetching post details:', error);
      });

    console.log(postDetail)
  };

  //comment
  const [comment, setComment] = useState<string>();
  const { socket } = useSocket();
  const { user } = useAuth();
  const handleSendComment = (e, postId) => {
    if (e.keyCode === 13 && comment?.trim() !== '') {
      socket?.emit("comment", {
        "userId": user?._id,
        "postId": postId,
        "content": comment.trim(),
        "image": ""
      });
    }
  }


  return (
    <List>
      {listData.map((e: any, i: any) => (
        // <ListItem key={i} onClick={()=>{router.push(`/home`)}}>
        <ListItem key={i}>
          <Card sx={{ width: 600, margin: '20px auto' }}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">{e.user.username.charAt(0).toUpperCase()}</Avatar>
              }
              action={<DialogReport />}
              title={e.user.username}
              subheader={new Date(e.createdAt).toLocaleString()}
            />
            <div onDoubleClick={handleLike}>
              {showHeart && (
                <FavoriteIcon
                  style={{
                    color: 'white',
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: 1, // Thêm zIndex để đảm bảo icon nằm trên swiper
                  }}
                  fontSize='large'
                />
              )}
              <KeenSliderWrapper>
                <SwiperControls
                  direction={direction}
                  style={{ position: 'relative', height: 500, width: '100%' }}
                />
              </KeenSliderWrapper>
            </div>
            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ marginRight: '5px', fontWeight: 'bold' }}>{e.user.username}:</Typography>
              <Typography variant="body2" color="text.secondary" style={{ fontSize: 15 }}>
                {e.content}
              </Typography>
            </CardContent>
            <CardActions style={{ paddingLeft: 15, paddingBottom: 5, display: 'flex', justifyContent: 'space-between' }} disableSpacing>
              <div>
                <IconButton aria-label="add to favorites" onClick={handleLike}>
                  {isLiked ? <FavoriteIcon style={{ color: '#ff3c3c' }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton aria-label="comment">
                  <ModeCommentIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </div>
              <div>
                <IconButton aria-label="save">
                  <TurnedInNotIcon />
                </IconButton>
              </div>
            </CardActions>
            <CardActions style={{ paddingTop: 5 }}>
              <Typography variant="body2" color="text.secondary">
                Total likes: 100
              </Typography>
            </CardActions>
            <CardActions style={{ paddingTop: 0 }} onClick={() => handlePostDetails(e._id)}>
              <Typography variant="body2" color="text.secondary">
                All comments
              </Typography>
            </CardActions>
            <CardActions>
              <TextField style={{ width: '100%' }} id="commet" label="Add a comment" variant="standard"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                onKeyDown={(event) => handleSendComment(event, e._id)}
              />
            </CardActions>

          </Card>
        </ListItem>
      ))}

      {/* post details */}
      <Dialog fullScreen open={openPostDetails} onClose={handleClosePostDetails} aria-labelledby='form-dialog-title' sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",

          },
        },
      }}>
        <DialogContentText >
          <PostDetails postDetails={postDetail} />
        </DialogContentText>
        <IconButton
          aria-label='close'
          onClick={handleClosePostDetails}
          sx={{ top: 8, left: 10, position: 'absolute', color: 'grey.200' }}
        >
          <Icon icon='tabler:x' fontSize={"35px"} />
        </IconButton>
      </Dialog>
    </List>
  )
}

export default ListPost
