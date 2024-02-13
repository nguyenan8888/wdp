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
import UploadsImage from './UploadsImage'
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

const defaultValues = {
  user: '',
  content: '',
  images: '',
  is_public: true
}
interface FormData {
  user: string
  content: string
  images: string[]
  is_public: boolean
}
interface AddPostProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddPost: React.FC<AddPostProps> = ({ setOpen }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    settings: { direction }
  } = useSettings()

  const [work, setWork] = useState({
    user: '',
    content: '',
    images: [],
    is_public: true
  })

  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = e.target.files
    console.log(work)
    const imagesArray = Array.from(newPhotos).map(photo => URL.createObjectURL(photo))

    setWork(prevWork => {
      return {
        ...prevWork,
        images: [...prevWork.images, ...imagesArray]
      }
    })
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setWork(prevWork => {
      return {
        ...prevWork,
        [name]: value
      }
    })
  }

  const handleToggleSwitch = () => {
    setWork(prevWork => {
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
      .create_post(work)
      .then(({ data }) => {
        if (data.isSuccess) {
          const { user, content, images, is_public } = data.data
          console.log(data)
          setOpen(false)
          router.push('/home')
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

  const userData = localStorage.getItem('userData');
  const userObject = userData ? JSON.parse(userData) : {};
  const userName = userObject.username;
  return (
    <Card>
      <Box sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }}>
        <form noValidate autoComplete='off' className='' onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <Box sx={{ width: 785, height: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {work.images.length < 1 && (
                <div>
                  <input
                    id='image'
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/*'
                    onChange={e => handleUploadPhotos(e)}
                    multiple
                  />
                  <label htmlFor='image'>
                    <Icon
                      icon='bi:upload'
                      fontSize={100}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                  </label>
                </div>
              )}
              {work.images.length > 0 && (
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
                    multiple
                  />
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
                      }}
                    />
                  </label>
                </Box>
              )}
            </Box>
            <Box sx={{ width: '400px', height: '100%', overflow: 'auto' }}>
              <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 2 }} src='/images/avatars/3.png' >
            {userName.charAt(0).toUpperCase()}
            </Avatar>
                <Box> {userName}</Box>
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
                  fullWidth
                />
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

      {/* <Box sx={{ display: { md: 'block', lg: 'none' } }}>
                <form noValidate autoComplete='off' className='' >
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'space-between' }}>
                        <Box sx={{ width: "100%", height: 800, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {work.images.length < 1 && (
                                <div>
                                    <input
                                        id="image"
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={(e) => handleUploadPhotos(e)}
                                        multiple
                                    />
                                    <label htmlFor="image" >
                                        <Icon icon='bi:upload' fontSize={100} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                    </label>
                                </div>
                            )}
                            {work.images.length > 0 && (
                                <Box sx={{ position: 'relative' }}>
                                    <KeenSliderWrapper sx={{ width: 790, height: 800, }}>
                                        <UploadsImage setWork={setWork} work={work} direction={direction} style={{ width: '100%' }} />
                                    </KeenSliderWrapper>

                                    <input
                                        id="image"
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={(e) => handleUploadPhotos(e)}
                                        multiple
                                    />
                                    <label htmlFor="image" style={{ position: 'absolute', bottom: 0 }}>
                                        <Icon icon='bi:upload' fontSize={50} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'grey', color: 'white', borderRadius: '5px', padding: '5px', margin: 20 }} />
                                    </label>
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ width: "100%", height: 800, overflow: "auto" }}>
                            <Box className='demo-space-x' sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 4 }} src='/images/avatars/3.png' />
                                <Box>Tran Dinh Cuong</Box>
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
                                    name="content"
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ marginBottom: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: "1.4rem", fontWeight: '500' }}>Hide like and view counts on this post</Typography>
                                    <Switch size="medium" />
                                </Box>
                                <Typography sx={{ fontSize: 13, }}>Only you will see the total number of likes and views on this post. You can change this later by going to the ··· menu at the top of the post. To hide like counts on other people's posts, go to your account settings.</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ marginBottom: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: "1.4rem", fontWeight: '500' }}>Turn off commenting</Typography>
                                    <Switch size="medium" />
                                </Box>
                                <Typography sx={{ fontSize: 13, }}>You can change this later by going to the ··· menu at the top of your pos</Typography>
                            </Box>
                            <Divider />

                            <Button variant='outlined' size='medium' onClick={handleSubmit} style={{ marginTop: 4 }}>
                                Publish
                            </Button>
                        </Box>
                    </Box>

                </form>
            </Box> */}
    </Card>
  )
}

export default AddPost
