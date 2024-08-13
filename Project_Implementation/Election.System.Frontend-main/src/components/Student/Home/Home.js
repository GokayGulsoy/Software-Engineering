import React, {useState, useEffect} from "react";
import Announcement from "../Announcement/Announcement";
import './Home.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";

function Home()
{
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("https://iyte-election.azurewebsites.net/announcements")
        .then((res) =>
            res.json() )
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
            <div className="container">
                <Typography sx={{textAlign:"center",marginTop:10}}><h1>ANNOUNCEMENTS</h1> </Typography>
                <div fixed="true" className="announcement">
                    {postList.map((announcement) => (
                        <Announcement key={announcement.id} announcementId={announcement.id} title={announcement.title} description={announcement.description}></Announcement>
                    ))}
                </div>
            </div>  
        );
    }
}

export default Home;