// ** MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'

// ** Next Import
import { useRouter } from 'next/router'

interface ListUser{
  listData: any,
}

const ListUser = (props: ListUser) => {
  const router = useRouter()
  const {listData} = props

  return (
    <List>
      {listData.map((e: any, i: any) => (
        <ListItem key={i} onClick={()=>{router.push(`/user-profile?userId=${e.id}`)}}>
          <ListItemAvatar>
            <Avatar src='/vuexy-nextjs-admin-template/demo-4/images/avatars/2.png' alt='Caroline Black' sx={{ height: 36, width: 36 }} />
          </ListItemAvatar>
          <ListItemText primary={e.username} secondary={`${e.firstname} ${e.lastname}`} />
        </ListItem>
      ))}
    </List>
  )
}

export default ListUser
