import React,{useState,useEffect}from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';


function Candidate(props){
    const {type,student,setVoteId,voteId,userId,isFinished,numberOfVotes} = props;
    
    const handleVote = (e) =>{
      e.preventDefault();
    
      fetch("https://iyte-election.azurewebsites.net/elections/vote-for-department-representative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterStudentId: userId,
          candidateStudentId: student.id,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));
      setVoteId(student.id);
    }
    if(type === "voting"){
        if(voteId === 0){
          return(
            <Card  id={student.id} sx={{ marginTop: 20,marginRight:10,marginLeft:10,marginBottom: 2,width:"400px",borderRadius:5}}>
                <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                  <CardContent>
                  <Typography sx={{justifyContent:"center",marginBottom:2,fontSize:30}} gutterBottom variant="h5" component="div">
                      {student.firstName+" "+student.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.gender}
                    </Typography>
                    <Typography sx={{marginTop:1}} variant="body2" color="text.secondary">
                    {student.department.name}
                    </Typography>
                    
                    <div style={{marginTop:10,justifyContent:"center",display:"flex"}}>
        
                      
                      <Button onClick={handleVote} variant='contained' sx={{backgroundColor:"#B61815",width:"20%"}} >VOTE</Button>
                    
                    </div>
                  
                  </CardContent>
                </CardActionArea>
              </Card>
            );
        }else{
          return(
            <Card  id={student.id} sx={{ marginTop: 20,marginRight:10,marginLeft:10,marginBottom: 2,width:"400px",borderRadius:5}}>
                <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                  <CardContent>
                    <Typography sx={{justifyContent:"center",marginBottom:2,fontSize:30}} gutterBottom variant="h5" component="div">
                      {student.firstName+" "+student.lastName}
                    </Typography>
                    
                    <Typography sx={{marginTop:1}} variant="body2" color="text.secondary">
                    {student.department.name}
                    </Typography>
                    {(voteId === student.id) ? (<div style={{marginTop:10,justifyContent:"center",display:"flex"}}>
                      <Button disabled={true}  sx={{fontSize:25,color:"#B61815 !important"}} >VOTED</Button>
                      </div>) : (<div style={{marginTop:10,justifyContent:"center",display:"flex"}}>
                        <Button disabled={true} variant='' sx={{fontSize:25,color:"#B61815 !important"}} >-</Button></div>)}        
                  </CardContent>
                </CardActionArea>
              </Card>
            );
        }
  }else{
    return(
      <Card  id={student.id} sx={{ marginTop: 20,marginRight:10,marginLeft:10,marginBottom: 2,width:"400px",borderRadius:5}}>
          <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
            <CardContent>
            <Typography sx={{justifyContent:"center",marginBottom:2,fontSize:30}} gutterBottom variant="h5" component="div">
                  {student.firstName+" "+student.lastName}
                </Typography>
                <Typography sx={{marginTop:1, marginBottom:5}} variant="body2" color="text.secondary">
                {student.department.name}
                </Typography>
                {(isFinished) ? (<div style={{fontSize:25,color:"#B61815"}}>
                  Number of Votes
              <p style={{margin:0,marginTop:5,fontSize:50}}>{numberOfVotes}</p>
              </div>

                ) : (<div style={{fontSize:25,color:"#B61815"}}>
                  Number of Votes
                  <p style={{margin:0,marginTop:5,fontSize:50}}>-</p>
                  </div>)}
               
            </CardContent>
          </CardActionArea>
        </Card>
      );
  }
    
}
export default Candidate;