import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function Operations(props) {
    const {userId} = props;

    const handleDeleteCandidates = () =>{
        fetch("https://iyte-election.azurewebsites.net/candidates",{
          method: "DELETE",
          
        })
        .then((res) => res.json())
        .then((result) =>{
          alert("Candidates have been deleted")
        })
        .catch((err) => {
          // Handle any errors
          console.log(err);
        });

    }
    const handleDeleteElectionResults = () =>{
        fetch("https://iyte-election.azurewebsites.net/elections",{
          method: "DELETE",
        })
        .then((res) => res.json())
        .then((result) =>{
          alert("Election results have been deleted")
        })
        .catch((err) => {
          // Handle any errors
          console.log(err);
        });

    }

    const handleDeleteDocuments = () =>{
        fetch("https://iyte-election.azurewebsites.net/documents",{
          method: "DELETE",
        })
        .then((res) => res.json())
        .then((result) =>{
          alert("Documents have been deleted");
          })
        .catch((err) => {
          // Handle any errors
          console.log(err);
        });

    }


    return (
        <div style={{display:"flex",justifyContent:"center"}}>
        <Card  id={userId} sx={{ display:"flex",marginTop: 20,marginBottom: 0,marginRight:5,marginLeft:5,width:"50%",borderRadius:3,justifyContent:"center",textAlign:"center"}}>
            <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
            <CardContent>
                <div style={{marginBottom:30,marginTop:30}}>
                    <h2>The following actions are important and cannot be undone<PriorityHighIcon sx={{color:"red"}}/><PriorityHighIcon sx={{color:"red"}}/><PriorityHighIcon sx={{color:"red"}}/></h2>

                </div>
                <div style={{marginBottom:30,marginTop:30}}>
                
                <Button onClick={handleDeleteCandidates} variant='contained' sx={{width:"50%",backgroundColor:"#B61815"}}>Delete Candidates</Button>
                </div>
                
                <div style={{marginBottom:30,marginTop:10}}>
                
                <Button onClick={handleDeleteDocuments} variant='contained' sx={{width:"50%",backgroundColor:"#B61815"}}>Delete Documents</Button>
                </div>
                <div style={{marginBottom:30,marginTop:10}}>
                
                <Button onClick={handleDeleteElectionResults} variant='contained' sx={{width:"50%",backgroundColor:"#B61815"}}>Delete Election Results</Button>
                </div>
                
            </CardContent>
            </CardActionArea>
        </Card>
        </div>
        
    
    );
}
export default Operations;