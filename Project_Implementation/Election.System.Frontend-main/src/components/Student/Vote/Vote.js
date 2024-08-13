import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Candidate from "./Candidate"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


function Vote(props) {
  const { userId } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [student,setStudent] = useState();
  const [studentList,setStudentList] = useState([]);
  const [voteId,setVoteId] = useState(0);
  const [departmentCandidateList, setDepartmentCandidateList] = useState([]);
  const [isActive,setIsActive] = useState(false);
  const [isFuture,setIsFuture] = useState(false);
  const [futureProcess,setFutureProcess] = useState();

  const handleProcessesFuture = (e) =>{
    const formData = new FormData();
    formData.append("process", "DEPARTMENT_REPRESENTATIVE");
    
    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://iyte-election.azurewebsites.net/processes/will-start-process?${queryParams}`;
  
    fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 204) {
          // Handle 204 No Content response
          return Promise.resolve(null);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data !== null) {
          // Handle successful response
          setIsFuture(true);
          setFutureProcess(data);
        } else {
          // Handle 204 No Content response
          setIsFuture(false);

        }
      })
      .catch((err) => console.log(err));

    
}
  const handleActiveProcess = (e) =>{
        
    const formData = new FormData();
    formData.append("process", "DEPARTMENT_REPRESENTATIVE");
    
    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://iyte-election.azurewebsites.net/processes/starting-process?${queryParams}`;

    fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 204) {
          // Handle 204 No Content response
          return Promise.resolve(null);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data !== null) {
          // Handle successful response
          
          setIsActive(true);
        } else {
          // Handle 204 No Content response
          setIsActive(false);
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() =>{
    fetch("https://iyte-election.azurewebsites.net/students/"+userId)
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
          setStudent(result);
          
        },
        (error) => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );

  },[userId])
  useEffect(() => {
    fetch("https://iyte-election.azurewebsites.net/elections/"+userId)
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
        if(result === null){
           setVoteId(0);
        }else{
          setVoteId(result.id);
        }
      
        
      },
      (error) => {
        console.log(error); 
      }
    );
  }, [userId]);

  useEffect(()=>{
    handleActiveProcess()
  },[isActive])

  useEffect(() =>{
    handleProcessesFuture();
  },[isFuture])

  useEffect(() => {
    const formData = new FormData();
    formData.append("process", "DEPARTMENT_CANDIDACY");
      
    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://iyte-election.azurewebsites.net/candidates?${queryParams}`;
  
    fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 204) {
          // Handle 204 No Content response
          return Promise.resolve(null);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data !== null) {
          setStudentList(data);
  
          const newArray = studentList.filter((candidate) =>
            candidate.department.name === student.department.name
          );
          
          setDepartmentCandidateList(newArray);
        }
      })
      .catch((err) => console.log(err));
  }, [student,studentList]);
  

  if (error) {
    return <div>Error!..</div>;
  } else if (!isLoaded) {
    return (
      <Box sx={{ marginTop:"20%",display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  } else if(isActive && isLoaded) {
    if(departmentCandidateList == 0){
      return(
      <div style={{display:"flex",justifyContent:"center",textAlign:"center"}}>
        <Card className='' sx={{display:"flex", marginTop: 15,borderRadius:5,width:"50%"}}>
      <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
        <CardContent>
         <Typography>There is no candidates at the moment</Typography>
         
        </CardContent>
      </CardActionArea>
    </Card>

      </div>
      
      );
    }else{
    return (
        <div className="" style={{display:"flex !important",justifyContent:"center !important"}}>
            
            <div>{departmentCandidateList.length}</div>
          <div fixed="true" className="announcement">
            {departmentCandidateList.map((candidate) => (
              <Candidate key={candidate.id} type="voting" voteId={voteId} student={candidate} setVoteId={setVoteId} userId={userId}/>
            ))}
          </div>
          
          
        </div>
        
    );
            }
  }else if(!isActive && isFuture){
    return(
    <div className='container'>
          <Card className='candidacy-card' sx={{ marginTop: 15,borderRadius:5}}>
          <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
            <CardContent>
             <Typography>There is no active process at the moment, you can see the next process </Typography>
             <Typography gutterBottom variant="h5" component="div">
                {futureProcess.process.replace("_"," ")}
              </Typography>
              <div style={{display:"flex",justifyContent:"center"}}>
              <div style={{marginRight:60}}>
                
                <Typography variant='h6'>
                    {futureProcess.startDate}
                </Typography>
              </div>
              <div style={{marginLeft:60}}>
              <Typography variant='h6'>
                    {futureProcess.endDate}
                </Typography>
              </div>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>

      </div>
    );

  }
  
  else{
      return(
        <Card className='candidacy-card' sx={{ marginTop: 15,borderRadius:5}}>
          <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
            <CardContent>
             <Typography>There is no active process at the moment, you can follow the announcements. </Typography>
             
            </CardContent>
          </CardActionArea>
        </Card>
      )
  }
}

export default Vote;