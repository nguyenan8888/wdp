// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Icon from 'src/@core/components/icon';
import toast from 'react-hot-toast'
import { userApi } from 'src/@core/apis'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import ListUser from 'src/@core/components/pop-up/list-user'
import storage from 'src/@core/utils/storage'
import DialogActionUser from 'src/@core/components/action-user/DialogActionUser'

const UserProfile = () => {
  const router = useRouter();
  const { userId }:any  = router.query;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const [profile, setProfile] = useState<any>({})
  const userData = storage.getProfile();
  const [open, setOpen] = useState<boolean>(false)
  const [popUpTitle, setPopUpTitle] = useState<boolean>(false)
  const [listDataFollower, setListDataFollower] = useState<any>([])
  const [listDataFollowing, setListDataFollowing] = useState<any>([])
  const [followed, setFollowed] = useState<boolean>(false)
  const [countFollower, setCountFollower] = useState<any>(listDataFollower.length)
  const [countFollowing, setCountFollowing] = useState<any>(listDataFollowing.length)

  const handleClickOpenPopUpFollower = () => {
    setPopUpTitle(true)
    setOpen(true)
  }

  const handleClickOpenPopUpFollowing = () => {
    setPopUpTitle(false)
    setOpen(true)
  }

  const handleClosePopUp = () => setOpen(false)

  useEffect(() => {
    fetchDataFollowing()
    fetchDataFollowers()
    fetchData();
  }, [userId]);

  useEffect(() => {
    setCountFollower(listDataFollower.length)
  }, [listDataFollower]);

  useEffect(() => {
    setCountFollowing(listDataFollowing.length)
  }, [listDataFollowing]);
  const fetchDataFollowing = async () => {
    setLoading(true);

    userApi
      .getFollowing(userId)
      .then(({ data }) => {
        if (data.isSuccess) {
          setListDataFollowing(data.data.user)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchDataFollowers = async () => {
    setLoading(true);

    userApi
      .getFollowers(userId)
      .then(({ data }) => {
        if (data.isSuccess) {
          setListDataFollower(data.data.user)
          const hasFollowed = data.data.user.find((e: any) => e.id === userData._id);
          setFollowed(hasFollowed ? true : false)
        } else {
          toast.error(data.message)
          console.log(data)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const fetchData = async () => {
    setLoading(true);

    userApi
      .profile(userId)
      .then(({ data }) => {
        if (data.isSuccess) {
          setProfile(data.data.user)
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const submitFollow = async () => {
    setLoading(true);

    userApi
      .follow(userId)
      .then(({ data }) => {
        if (data.isSuccess) {
          setFollowed(true)
          fetchDataFollowers()
        } else {
          toast.error(data.message)
        }
      })
      .catch(err => {
        toast.error(err?.response)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const itemData = [
    {
      id:'1',
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
    },
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
    },
  ];
  
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent style={{ display: 'flex' }}>
            <Avatar
              style={{ margin: '0 50px' }}
              alt='John Doe'
              src='/images/avatars/1.png'
              sx={{ width: 150, height: 150 }}
            />
            <Typography style={{ marginLeft: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography style={{ fontWeight: 'bold', margin: '0' }} sx={{ mb: 2 }}>
                  {profile.username}
                </Typography>
                {followed? 
                  <Button variant='contained' disabled style={{ marginLeft: '20px' }}>Followed</Button>
                  :<Button variant='contained' onClick={submitFollow} style={{ marginLeft: '20px' }}>Follow</Button>
                }
                <DialogActionUser userData={profile}/>
              </div>
              <Typography style={{ display: 'flex', margin: '20px 0' }}>
                <Typography style={{ display: 'flex', marginRight: '40px' }}>
                  <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>20</Typography>posts
                </Typography>
                <Typography onClick={handleClickOpenPopUpFollower} style={{ display: 'flex', marginRight: '40px' }}>
                  <Typography style={{ fontWeight: 'bold', marginRight: '4px' }}>{countFollower}</Typography>followers
                </Typography>
                <Typography onClick={handleClickOpenPopUpFollowing} style={{ display: 'flex', marginRight: '40px' }}>
                  <Typography style={{ fontWeight: 'bold', margin: '0 4px' }}>{countFollowing}</Typography>following
                </Typography>
              </Typography>
              <Typography style={{ fontWeight: 'bold' }} sx={{ mb: 2 }}>
                {profile.firstName} {profile.lastName}
              </Typography>
                {profile.biography}
              </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TabContext value={value}>
              <TabList centered onChange={handleChange} aria-label='simple tabs example'>
                <Tab value='1' label={<div style={{display:'flex'}}><Icon icon='ph:layout' fontSize={20} style={{marginRight:'5px'}}/>Posts</div>}/>
                <Tab value='2' label={<div style={{display:'flex'}}><Icon icon='carbon:tag' fontSize={20} style={{marginRight:'5px'}}/>Tagged</div>} />
              </TabList>
              <TabPanel value='1'>
              <ImageList sx={{ width:'100%', height: '100%'}} cols={3}>
                {itemData.map((item: any) => (
                  <ImageListItem key={item.img}>
                    <img
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              </TabPanel>
              <TabPanel value='2'>
              <ImageList sx={{ width: '100%', height: '100%' }} cols={3}>
                {itemData.map((item: any) => (
                  <ImageListItem key={item.img}>
                    <img
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={'xs'}
        scroll={'paper'}
        onClose={handleClosePopUp}
        aria-labelledby='customized-dialog-title'
        aria-describedby='scroll-dialog-description'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4, display: 'flex', justifyContent: 'space-between', marginLeft: '20px'}}>
          <Typography variant='h6' component='span' style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
            {popUpTitle? 'Follower':'Following'}
          </Typography>
          <Button aria-label='close' onClick={handleClosePopUp}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <ListUser listData={popUpTitle? listDataFollower: listDataFollowing}/>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default UserProfile
