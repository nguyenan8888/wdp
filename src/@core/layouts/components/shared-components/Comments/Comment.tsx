import React from 'react'
import { Divider, Avatar, Grid, Paper, Button, Chip } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import styles from './comments.module.css';
import { useAuth } from 'src/hooks/useAuth';
const {user} = useAuth
const Comment = ({comments}) => {
    return (

        <Box sx={{ overflow: 'auto' }}>
            <div className={styles.boxcomment} >
                <ul className={styles.main}>
                   {
                    comments.map((comment) =>(
                        <li >
                        {/* main comment */}
                        <Box >
                            <Grid container wrap="nowrap" spacing={2}>
                                <Grid item>
                                    <Avatar alt="Remy Sharp" src='' />
                                </Grid>
                                <Grid justifyContent="left" item xs zeroMinWidth>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0, textAlign: "left" }}>{comment.firstName} {comment.lastName}</h4>
                                        <Icon icon='pepicons-pencil:dots-x' fontSize={20} style={{ marginRight: '5px' }} />
                                    </Box>
                                    <p style={{ textAlign: "left" }}>
                                      {comment.content}
                                    </p>
                                    <p style={{ textAlign: "left", color: "gray" }}>
                                        <span>99p</span>
                                        <Button>
                                            Like
                                        </Button>
                                        <Button>
                                            Reply
                                        </Button>

                                    </p>
                                </Grid>
                            </Grid>
                        </Box>
                       
                    </li>
                    ))
                   }
                
                </ul>
            </div>
        </Box>
    )
}

export default Comment
