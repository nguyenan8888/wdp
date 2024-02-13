// ** React Imports
import { useState, ElementType, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button, { ButtonProps } from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Avatar from '@mui/material/Avatar'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { EditorState } from 'draft-js'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import storage from 'src/@core/utils/storage'

// ** Apis
import { userApi } from 'src/@core/apis'
import toast from 'react-hot-toast'

interface Data {
  gender: string
  lastName: string
  dob: any
  firstName: string
  username: string
  biography: any
}

const initialData: Data = {
  username: '',
  gender: '',
  dob: '',
  firstName: '',
  lastName: '',
  biography: EditorState.createEmpty(),
}

const defaultValues = {
  username: '',
  gender: '',
  dob: '',
  firstName: '',
  lastName: '',
  biography: EditorState.createEmpty(),
}

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [date, setDate] = useState<DateType>(new Date())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const userData = storage.getProfile();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    userApi
      .profile(userData._id)
      .then(({ data }) => {
        if (data.isSuccess) {
          setFormData({
            username: data.data.user.username,
            gender: data.data.user.gender,
            dob: data.data.user.dob,
            firstName: data.data.user.firstName,
            lastName: data.data.user.lastName,
            biography: data.data.user.biography
          })
          console.log(data.data.user);
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

  // ** Hooks
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors }
  } = useForm({ defaultValues })

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  // const onSubmit = () => setOpen(true)

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const onAccountFormSubmit = () => {
    const { username, gender, firstName, lastName } = formData;
    setLoading(true)
    userApi
      .editProfile({ username, gender, firstName, lastName })
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success('Account Changed Successfully')
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
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Profile Details' />
          <form>
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={5} sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={12} sm={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' , width:'80%'}}>
                    <Avatar
                      style={{ marginRight: '10px' }}
                      alt='John Doe'
                      src={imgSrc}
                      sx={{ width: 150, height: 150 }}
                    />
                    <div style={{width:'100%'}}>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        Upload Photo
                        <input
                          hidden
                          type='file'
                          value={inputValue}
                          accept='image/png, image/jpeg'
                          onChange={handleInputImageChange}
                          id='account-settings-upload-image'
                        />
                      </ButtonStyled>
                      <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                        Reset
                      </ResetButtonStyled>
                      <Typography sx={{ mt: 2, color: 'text.disabled', fontSize: '10px' }}>
                        Allowed PNG or JPEG. Max size of 800K.
                      </Typography>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </form>
          <Divider />
          <form>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    label='Username'
                    placeholder='Enter your username'
                    value={formData.username}
                    onChange={e => handleFormChange('username', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Typography style={{fontSize:'13px'}}>Gender</Typography>
                  <RadioGroup row aria-label='controlled' name='gender' value={formData.gender} onChange={e => handleFormChange('gender', e.target.value)}>
                    <FormControlLabel value='Male' control={<Radio />} label='Male' />
                    <FormControlLabel value='Female' control={<Radio />} label='Female' />
                    <FormControlLabel value='Other' control={<Radio />} label='Other' />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePickerWrapper>
                    <DatePicker
                      value={formData.dob}
                      id='basic-input'
                      popperPlacement={popperPlacement}
                      onChange={(date: any) => handleFormChange('dob', date)}
                      dateFormat={'dd-MM-yyyy'}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='D.O.B'/>}
                      name='dob'
                    />
                  </DatePickerWrapper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='First Name'
                    placeholder='John'
                    value={formData.firstName}
                    name='firstName'
                    onChange={e => handleFormChange('firstName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Last Name'
                    placeholder='Doe'
                    value={formData.lastName}
                    name='lastName'
                    onChange={e => handleFormChange('lastName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography style={{fontSize:'13px'}}>Biography</Typography>
                  <div style={{border:'1px solid #d2d2d2', borderRadius:'10px', padding:'10px'}}>
                    <EditorWrapper
                      sx={{
                        '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
                        '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 }
                      }}
                    >
                      <ReactDraftWysiwyg
                        editorState={formData.biography}
                        onEditorStateChange={e => handleFormChange('biography', e)}
                        placeholder='Write your biography...'
                        toolbar={{
                          options: ['inline', 'list', 'link', 'image'],
                          inline: {
                            inDropdown: false,
                            options: ['bold', 'italic', 'underline']
                          },
                          list: {
                            inDropdown: false,
                            options: ['unordered', 'ordered']
                          },
                          link: {
                            inDropdown: false,
                            options: ['link']
                          }
                        }}
                      />
                    </EditorWrapper>
                  </div>
                </Grid>
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                  <Button onClick={onAccountFormSubmit} variant='contained' sx={{ mr: 4 }}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Delete Account Card */}
      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title='Delete Account' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name='checkbox'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label='I confirm my account deactivation'
                        sx={{ '& .MuiTypography-root': { color: errors.checkbox ? 'error.main' : 'text.secondary' } }}
                        control={
                          <Checkbox
                            {...field}
                            size='small'
                            name='validation-basic-checkbox'
                            sx={errors.checkbox ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText
                      id='validation-basic-checkbox'
                      sx={{ mx: 0, color: 'error.main', fontSize: theme => theme.typography.body2.fontSize }}
                    >
                      Please confirm you want to delete account
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
                Deactivate Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid> */}

      {/* Deactivate Account Dialogs */}
      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography>Are you sure you would like to cancel your subscription?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default TabAccount
