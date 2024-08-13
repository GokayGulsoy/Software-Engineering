import React, {useState, useEffect} from "react";
import Announcement from "./Announcement";
import './AnnouncementPage.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AnnouncementForm from "./AnnouncementForm";
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';


function AnnouncementPage(props)
{
    const {userId} = props;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    const [isAdded, setIsAdded] = useState(false);

    const refreshPosts = () => {
        fetch("https://iyte-election.azurewebsites.net/announcements")
        .then((res) => {
            if (res.status === 204) {
              // Handle 204 No Content response
              return Promise.resolve(null);
            } else {
              return res.json();
            }
          })
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result);
            },
            (error) => {
                console.log(error);
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    useEffect(() => {
        refreshPosts();
    }, [postList]);

    if(error){
        return <div>Error!..</div>
    } else if(!isLoaded){
        return (
            <Box sx={{ marginTop:"30%",display: 'flex' ,textAlign: 'center',justifyContent:'center'}}>
                <CircularProgress />
            </Box>
        );
    } else {
        return (
            <div>
                {isAdded ?  (<div className="container-announcement">
                    <div className="button"><IconButton  sx={{backgroundColor:"#B61815",padding:0,margin:8,height:50,width:50}} onClick={(e) => setIsAdded(false)} aria-label="delete">
                        <RemoveIcon sx={{color:"white"}}/>
                </IconButton>
                
                </div>
                <div fixed="true" className="announcement"> <AnnouncementForm userId={userId}></AnnouncementForm></div>
                
                </div>) : 
                (<div className="container-announcement"><div className="button" ><IconButton sx={{backgroundColor:"#B61815",margin:8,height:50,width:50}} onClick={(e) => setIsAdded(true)} aria-label="add">
                        <AddIcon sx={{color:"white"}}/>
                </IconButton></div>
                <div fixed="true" className="announcement">
                    {postList.map((announcement) => (
                        <Announcement key={announcement.id} userId={userId} announcementId={announcement.id} title={announcement.title} description={announcement.description} startDate={announcement.startDate} endDate={announcement.endDate}></Announcement>
                    ))}
                </div>
                </div>)}
                 
                
        </div>
            
        );
    }
}

export default AnnouncementPage;