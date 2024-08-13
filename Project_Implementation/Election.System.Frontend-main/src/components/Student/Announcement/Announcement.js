import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Img from '../../../iyte_logo.jpg'
import './Announcement.css'


function Announcement(props)
{
    const {announcementId, title, description} = props;

    return (
      <Card className='announcement-card' id={announcementId} sx={{ marginTop: 10}}>
        <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
          <CardMedia
            component="img"
            height="140"
            image={Img}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
}

export default Announcement;