/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { Fragment, useState, ChangeEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { SelectChangeEvent } from '@mui/material/Select'
import { styled, Breakpoint } from '@mui/material/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { Icon } from '@iconify/react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'

// Styled component for the form
const Form = styled('form')({
  margin: 'auto',
  display: 'flex',
  width: 'fit-content',
  flexDirection: 'column'
})

const emails = ['Report', 'Unfollow', 'Add to favorites', 'Go to post', 'Sheare', 'Cancel'];

const DialogReport = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [fullWidth, setFullWidth] = useState<boolean>(true)
  const [maxWidth, setMaxWidth] = useState<Breakpoint>('sm')

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const handleListItemClick = (value: string) => {
    if (value) handleClose();
  };

  return (
    <Fragment>
      <Button  variant='text' onClick={handleClickOpen} style={{borderRadius:"100%"}}>
        <Icon icon='ph:dots-three-bold' fontSize={20}/>
      </Button>
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
                      <ListItemText style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} primary={email} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default DialogReport
