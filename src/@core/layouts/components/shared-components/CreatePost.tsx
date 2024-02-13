// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Fab from '@mui/material/Fab'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Input } from '@mui/material'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import AddPost from './CreatePost/AddPost'

const style = {

};
const CreatePost = () => {
    // ** State
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const userData = localStorage.getItem('userData');
    const userObject = userData ? JSON.parse(userData) : {};
    const userName = userObject.username;
    return (

        <Fragment>
            <div onClick={handleClickOpen}>
                <CustomTextField fullWidth id='outlined-full-width' placeholder={`${userName} Hôm nay ban nghi gi`} InputProps={{ inputProps: { style: { textAlign: 'start', padding: 10, borderRadius: 6 }, }, style: { borderRadius: 999 }, }} />
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "1200px", 
                    },
                },
            }}>
                <DialogContentText >
                    <AddPost  setOpen={setOpen} />
                </DialogContentText>
            </Dialog>
        </Fragment>
    )
}

export default CreatePost
