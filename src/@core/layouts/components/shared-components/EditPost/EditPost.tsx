/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, Input, FormControl } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useState } from 'react'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'

// ** Custom Component Import
import TextField from '@mui/material/TextField'

import Switch from '@mui/material/Switch'

import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import UploadsImage from '../CreatePost/UploadsImage'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import PropTypes from 'prop-types'

// ** Apis
import { postApi } from 'src/@core/apis'
import { useRouter } from 'next/router'
import { log } from 'console'


interface EditPostsProps {
  postDetails: any,
  handleCloseEditPost: () => void,
}


const EditPost = (props: EditPostsProps) => {
  const { postDetails, handleCloseEditPost } = props;
  const [loading, setLoading] = useState<boolean>(false)
  console.log('postDetails postDetails', postDetails)
  const {
    settings: { direction }
  } = useSettings()


  const [work, setWork] = useState({
    user: '',
    content: '',
    images: [],
    is_public: true,
    ...(postDetails.data.post || {})
  })
  console.log("work", work)


  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = e.target.files
    console.log(work)
    const imagesArray = Array.from(newPhotos).map(photo => URL.createObjectURL(photo))

    setWork((prevWork: any) => {
      return {
        ...prevWork,
        images: [...prevWork.images, ...imagesArray]
      }
    })
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setWork((prevWork: any) => {
      return {
        ...prevWork,
        [name]: value
      }
    })
  }

  const handleToggleSwitch = () => {
    setWork((prevWork: any) => {
      return {
        ...prevWork,
        is_public: !prevWork.is_public
      }
    })
  }

  const router = useRouter()
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    postApi
      .edit_post(postDetails.data.post._id, work)
      .then(({ data }) => {
        if (data.isSuccess) {
          console.log(data)
          handleCloseEditPost(false)
          router.push('/home')
          window.location.href = '/home';
        } else {
          toast.error(data.message)
          console.log(data.message)
        }
      })
      .catch(error => {
        console.error('Error submitting the post:', error)
        toast.error('An error occurred while submitting the post')
      })
      .finally(() => {
        setLoading(false)
      })
  }



  return (
    <Box>
      <Box sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }}>
        <form noValidate autoComplete='off' className='' onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <Box sx={{ width: '70%', height: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {work.images && work.images.length < 1 && (
                <div>
                  <input
                    id='image'
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/*'
                    onChange={e => handleUploadPhotos(e)}
                    multiple />
                  <label htmlFor='image'>
                    <Icon
                      icon='bi:upload'
                      fontSize={100}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                  </label>
                </div>
              )}
              {work.images && work.images.length > 0 && (
                <Box sx={{ position: 'relative' }}>
                  <KeenSliderWrapper sx={{ width: 785, height: 800 }}>
                    <UploadsImage setWork={setWork} work={work} direction={direction} style={{ width: '100%' }} />
                  </KeenSliderWrapper>

                  <input
                    id='image'
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/*'
                    onChange={e => handleUploadPhotos(e)}
                    multiple />
                  <label htmlFor='image' style={{ position: 'absolute', bottom: 0 }}>
                    <Icon
                      icon='bi:upload'
                      fontSize={50}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'grey',
                        color: 'white',
                        borderRadius: '5px',
                        padding: '5px',
                        margin: 20
                      }} />
                  </label>
                </Box>
              )}
            </Box>
            <Box sx={{ width: '30%', height: '100%', overflow: 'auto', paddingLeft: '10px' }}>
              <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 2 }} src='/images/avatars/3.png'>
                  {work.user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box> {work.user.username}</Box>
              </Box>
              <Box sx={{ marginBottom: 4 }}>
                <TextField
                  rows={8}
                  multiline
                  variant='standard'
                  placeholder="What's happening?"
                  id='textarea-standard-static'
                  onChange={handleChange}
                  value={work.content}
                  name='content'
                  fullWidth />
              </Box>
              <Box sx={{ marginBottom: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: '500' }}>
                    Publish Post
                  </Typography>
                  <Switch size='medium' checked={work.is_public} onChange={handleToggleSwitch} />
                </Box>
                <Typography sx={{ fontSize: 13 }}>
                  Only you will see the total number of likes and views on this post. You can change this later by going
                  to the ··· menu at the top of the post. To hide like counts on other people's posts, go to your
                  account settings.
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ marginBottom: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: '500' }}>Turn off commenting</Typography>
                  <Switch size='medium' />
                </Box>
                <Typography sx={{ fontSize: 13 }}>
                  You can change this later by going to the ··· menu at the top of your pos
                </Typography>
              </Box>
              <Divider />
              <Button type='submit' variant='outlined' size='medium' style={{ marginTop: 4 }}>
                Share
              </Button>
            </Box>
          </Box>
        </form>
      </Box>


    </Box>
  )
}

export default EditPost
