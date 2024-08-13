import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea } from '@mui/material';


function AnnouncementForm(props) {
  const { userId } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChangeStartDate = (e) => {
    console.log(e.target.value)
    setStartDate(e.target.value);
 
  };

  const handleChangeFinishDate = (e) => {
    setEndDate(e.target.value);
   
  };

  const handleSubmitAnnouncement = (e) => {
    e.preventDefault();
    let startCompareDate = new Date(startDate).getTime()
    let FinishCompareDate = new Date(endDate).getTime()

    if(startCompareDate>FinishCompareDate){
      alert("Start date cannot be greater than end date!")
    }else if(title === "" || description === ""){
      alert("Please fill the announcement title and description!")
  }
    else{
    fetch("https://iyte-election.azurewebsites.net/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        administrationId: userId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setStartDate('');
    setEndDate('');
    setTitle('');
    setDescription('');
  }
  };

  return (
    <Card className='announcement-card' sx={{ marginTop: 15, display: "flex", justifyContent: "center",borderRadius:5 }}>
      <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
        
        <CardContent sx={{ display: "block", justifyContent: "center" }}>
          <form>
            <TextField
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              id="outlined-basic"
              label="Title"
              variant="outlined"
              sx={{ width: "70%", marginBottom: 3,marginTop:5 }}
            />
            <TextField
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              id="outlined-basic"
              label="Description"
              variant="outlined"
              sx={{ width: "70%", marginBottom:0 }}
            />

           
              <div style={{  }}>
                <h4 style={{marginBottom:5}}>Start Date</h4>
                <input
                  value={startDate}
                  type='date'
                  onChange={handleChangeStartDate}
                  style={{ width: "70%", height: 35,fontSize:18,textAlign:"center" }}
                />
              </div>
              <div style={{  }}>
                <h4 style={{marginBottom:5}}>Finish Date</h4>
                <input

                  value={endDate}
                  type='date'
                  onChange={handleChangeFinishDate}
                  style={{ width: "70%", height: 35,fontSize:18,textAlign:"center" }}
                />
              </div>
           
            <div style={{ marginTop: 40,marginBottom: 20 }}>
              <Button
                onClick={handleSubmitAnnouncement}
                sx={{ width: "70%", height:45, backgroundColor: '#B61815' ,fontWeight:"Bold"}}
                variant="contained"
              >
                ADD ANNOUNCEMENT
              </Button>
            </div>
          </form>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default AnnouncementForm;