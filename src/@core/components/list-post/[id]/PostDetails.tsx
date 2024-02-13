/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, CardActions, Dialog, DialogContent, DialogTitle, Grid, IconButton, Input, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from "@mui/material";
import { Box, Breakpoint, maxWidth, useTheme } from "@mui/system";
import React, { useState, useEffect, useRef } from "react";
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

// ** MUI Imports
import Avatar from '@mui/material/Avatar'

// ** Custom Component Import
import TextField from '@mui/material/TextField'

import Switch from '@mui/material/Switch'


import Divider from '@mui/material/Divider';

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Comment from "src/@core/layouts/components/shared-components/Comments/Comment";

import EditPost from "src/@core/layouts/components/shared-components/EditPost/EditPost";

import socketIOClient from "socket.io-client";
import { io } from "socket.io-client";
import { useSocket } from "src/hooks/useSocket";
import { useAuth } from "src/hooks/useAuth";
const emails = ['edit', 'Report', 'Unfollow', 'Add to favorites', 'Go to post', 'Sheare', 'Cancel'];

interface postDetail {
    postDetails: any,
}




const PostDetails = (props: postDetail) => {
    const { postDetails } = props
    const [open, setOpen] = useState<boolean>(false)
    const [expanded, setExpanded] = React.useState(false);
    const [fullWidth, setFullWidth] = useState<boolean>(true)
    const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')
    // const [user, setUser] = useState<boolean>(false);

    const handleClose = () => setOpen(false)
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleListItemClick = (value: string) => {
        if (value === 'edit') {
            setOpenEditPost(true)

        }
        if (value === 'Cancel') {
            setOpen(false)

        }

    };

    const handleClickOpen = () => setOpen(true)

    // ** State
    const [value, setValue] = useState<string>('Controlled')

    const { user } = useAuth();

    const userIsPostOwner = postDetails.data.post.user._id === user?._id
    console.log("local stogar", user?.username)


    // edit post

    const [openEditPost, setOpenEditPost] = useState(false)

    // ** Hooks
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpenEP = () => setOpenEditPost(true)

    const handleCloseEditPost = () => setOpenEditPost(false);

    // comment
    console.log(postDetails.data.post._id)
    const [comments, setComments] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        socket?.on(`comment-post-${postDetails.data.post._id}`, (data) => {
            setComments((cmt) => [...cmt, data])

        })
    }, [])
    console.log('cmt', comments)

    //comment postDetail

    const [comment, setComment] = useState<string>();


    const handleSendComment = (e) => {
        if (e.keyCode === 13 && comment?.trim() !== '') {
            socket?.emit("comment", {
                "userId": user?._id,
                "postId": postDetails.data.post._id,
                "content": comment.trim(),
                "image": ""
            });
        }
    }


    return (
        <Card sx={{ width: '100vw', height: '100vh' }}>
            <Box  >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '70%', display: 'flex', height: '100vh', background: 'black' }}>
                        <img style={{ width: '100%', objectFit: 'contain' }} src="https://i.pinimg.com/1200x/97/f6/00/97f6003041c8f8c0aaf5dfd0b5d9e4cb.jpg" alt="" />
                    </Box>
                    <Box sx={{ width: '30%', overflow: "hidden", paddingLeft: '20px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <Avatar aria-label="recipe">{postDetails.data.post.user.username.charAt(0).toUpperCase()}</Avatar>
                                <Box>{postDetails.data.post.user.username}</Box>
                            </Box>
                            <Box>
                                <Icon icon='pepicons-pencil:dots-x' fontSize={20} style={{ marginRight: '5px' }} onClick={handleClickOpen} />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', }}>
                            {/* người đăng bài post này */}
                            <Box>
                                <Box sx={{ marginBottom: 4 }}>
                                    <Typography >{postDetails.data.post.content}</Typography>
                                </Box>
                            </Box>

                            {/* phần action của bạn */}
                            <Box>
                                <Divider />
                                <CardActions style={{ paddingBottom: 5, display: 'flex', justifyContent: 'space-between' }} disableSpacing>
                                    <div>
                                        <IconButton aria-label="add to favorites" style={{ paddingLeft: 0 }}>
                                            <FavoriteIcon />
                                        </IconButton>
                                        <IconButton aria-label="comment"  >
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
                                <CardActions>
                                    <TextField
                                        style={{ width: '100%' }}
                                        id="comment"
                                        label="Add a comment"
                                        variant="standard"
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        onKeyDown={(event) => handleSendComment(event)}
                                    />
                                </CardActions>

                            </Box>
                            {/* những comment của bài post này */}
                            <Box sx={{ height: '700px', overflow: 'auto' }}>
                                <Comment comments={comments} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* list action */}
            <Dialog
                open={open}
                maxWidth={maxWidth}
                fullWidth={fullWidth}
                onClose={handleClose}
                aria-labelledby='max-width-dialog-title'
            >
                <DialogContent>
                    <List sx={{ pt: 0 }}>
                        {emails.map((email) => (
                            <ListItem disableGutters key={email}>
                                <ListItemButton onClick={() => handleListItemClick(email)}>
                                    {(email === 'edit' && !userIsPostOwner) ? null : (
                                        <ListItemText style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} primary={email} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            {/* edit post */}
            <Dialog fullScreen open={openEditPost} onClose={handleCloseEditPost} aria-labelledby='full-screen-dialog-title'>
                <DialogTitle id='full-screen-dialog-title'>
                    <IconButton
                        aria-label='close'
                        onClick={handleCloseEditPost}
                        sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
                    >
                        <Icon icon='tabler:x' />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <EditPost postDetails={postDetails} handleCloseEditPost={handleCloseEditPost} />
                </DialogContent>

            </Dialog>
        </Card>
    )
}

export default PostDetails;
