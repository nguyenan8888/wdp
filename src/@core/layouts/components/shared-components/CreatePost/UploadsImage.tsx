// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Direction } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'

const UploadsImage = ({ setWork, work }, { direction, style }: { direction: Direction, style?: any }) => {
    // ** States

    // ** Hook
    const [ref] = useKeenSlider({
        rtl: direction === 'rtl'
    })

    const handleRemovePhoto = (indexToRemove) => {
        setWork((prevWork) => {
            return {
                ...prevWork,
                images: prevWork.images.filter((_, index) => index !== indexToRemove),
            };
        });
    };

    return (
        <Box ref={ref} className='keen-slider' sx={{ width: 700, height: 800 }}>
            {
                work?.images?.map((photo, index) => (
                    <Box className='keen-slider__slide' key={index} >
                        {photo instanceof Object ? (
                            <img style={style} src={URL.createObjectURL(photo)} alt="work" />
                        ) : (
                            <img style={style} src={photo} alt="work" />
                        )}
                        <button type='button' onClick={() => handleRemovePhoto(index)} style={{ position: 'absolute', right: 0, top: 0 , border:'none', background:'rgba(0, 0, 0, 0)' }}>
                            <Icon icon='material-symbols:delete-outline' fontSize={50} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'grey', color: 'white', borderRadius: '5px', padding: '5px', margin: 20 }} />
                        </button>
                    </Box>
                ))
            }
        </Box>
    )
}

export default UploadsImage
