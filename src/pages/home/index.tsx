// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import ListPost from 'src/@core/components/list-post';

// ** Apis
import { postApi } from 'src/@core/apis'
import toast from 'react-hot-toast'
import Card from '@mui/material/Card';
import Box from '@mui/system/Box';
import { Avatar, Divider } from '@mui/material';
import CreatePost from 'src/@core/layouts/components/shared-components/CreatePost';

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const [listPost, setListPost] = useState<any>([])

  const userData = localStorage.getItem('userData');
  const userObject = userData ? JSON.parse(userData) : {};
  const userName = userObject?.username || 'Guest';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    postApi
      .newFeed()
      .then(({ data }) => {
        if (data.isSuccess) {
          setListPost(data.data.posts)
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

  return (
    <>
      <Card sx={{ width: 600, margin: '20px auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4, padding: 2 }}>
            <Avatar alt='Victor Anderson' sx={{ width: 50, height: 50, marginRight: 2 }} src='/images/avatars/3.png' >
            {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ width: 1200 }}><CreatePost /></Box>

          </Box>
          <Divider variant="fullWidth" sx={{ marginLeft: 2, marginRight: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, justifyContent: 'space-between' }}>
            <Box>
            {/* ?ICON */}
            </Box>
          </Box>
        </Box>
      </Card>

      <Box>
        <ListPost listData={listPost}/>
      </Box>
    </>
  );
}

export default Home
