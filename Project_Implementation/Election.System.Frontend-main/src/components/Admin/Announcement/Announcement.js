import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Button } from '@mui/material';
import Img from '../../../iyte_logo.jpg';
import './Announcement.css';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Announcement(props) {
  const { announcementId, title, description, userId,startDate,endDate} = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editStartDate, setStartDate] = useState(startDate.split("T")[0]);
  const [editEndDate, setEndDate] = useState(endDate.split("T")[0]);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const handleChangeStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeFinishDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Perform edit logic here
  };

  const handleSave = (e) => {
    e.preventDefault();
    let startCompareDate = new Date(editStartDate).getTime()
    let finishCompareDate = new Date(editEndDate).getTime()
    console.log(startCompareDate)
    console.log(finishCompareDate)
    if(startCompareDate > finishCompareDate){
      alert("Start date cannot be greater than end date!")}
    else if(editTitle === "" || editDescription === ""){
        alert("Please fill the announcement title and description!")
    }
    else{
        fetch("https://iyte-election.azurewebsites.net/announcements/"+announcementId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: announcementId,
            title: editTitle,
            description: editDescription,
            startDate: editStartDate,
            endDate: editEndDate,
            administrationId: userId,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));
          setIsEditing(false);
  }

  };
  const handleCancel = (e) =>{
      setIsEditing(false);
      setEditDescription(description);
      setEditTitle(title);
      setStartDate(startDate.split("T")[0]);
      setEndDate(endDate.split("T")[0]);
  };

  const handleDelete = () => {
    fetch("https://iyte-election.azurewebsites.net/announcements/"+announcementId,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id : announcementId,
      }),
    })
    .then((res) => res.json())
    .then((result) =>{console.log(result)})
    .catch((err) => {
      // Handle any errors
      console.log(err);
    });
  };

  return (
    <Card className="announcement-card" id={announcementId} sx={{ marginTop: 7,marginBottom:5 }}>
      <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
        <CardMedia component="img" height="140" image={Img} alt="green iguana" />
        <CardContent>
          {isEditing ? (
            <TextField value={editTitle} onChange={(e) => setEditTitle(e.target.value)}  id="outlined-basic" label="Title" variant="outlined" sx={{width: "70%",marginBottom:3}} />
          ) : (
            <Typography gutterBottom variant="h5" component="div">
              {editTitle}
            </Typography>
          )}
          {isEditing ? (
            <TextField value={editDescription} onChange={(e) => setEditDescription(e.target.value)} id="outlined-basic" label="Description" variant="outlined" sx={{width: "70%", marginBottom:0}} />
            
          ) : (
            <Typography variant="body2" color="text.secondary">
              {editDescription}
            </Typography>
          )}
          {isEditing ? (<div style={{ marginBottom:10 }}><div style={{ marginBottom:5 }}>
                <h4 style={{marginBottom:5}}>Start Date</h4>
                <input
                  value={editStartDate}
                  type='date'
                  onChange={handleChangeStartDate}
                  style={{ width: "70%", height: 35,fontSize:18,textAlign:"center" }}
                />
              </div>
              <div style={{  }}>
                <h4 style={{marginBottom:5}}>Finish Date</h4>
                <input

                  value={editEndDate}
                  type='date'
                  onChange={handleChangeFinishDate}
                  style={{ width: "70%", height: 35,fontSize:18,textAlign:"center" }}
                />
              </div>
              </div>
              ) : (<div></div>)}
          
            {isEditing ? (
              <div className="buttons" style={{display: "flex",justifyContent:"center"}}>
              <Button onClick={handleSave} variant='contained' sx={{width:"30%",marginRight:3,backgroundColor:"#B61815"}}>Save</Button>
              <Button onClick={handleCancel} variant='contained'sx={{width:"30%",marginLeft:3,backgroundColor:"#B61815"}}>Cancel</Button>
              </div>
            ) : (
              <div className="buttons" style={{display: "flex",justifyContent:"space-between"}}>
              <Button onClick={handleEdit}><EditIcon sx={{color:"black",fontSize:"35px",marginLeft:2}} /></Button>
              <Button onClick={handleDelete}><DeleteIcon sx={{color:"black",fontSize:"35px",marginRight:2}}/></Button>
              </div>  
            )}
            
          
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Announcement;