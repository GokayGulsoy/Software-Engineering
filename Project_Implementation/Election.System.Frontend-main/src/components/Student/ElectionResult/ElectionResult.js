import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Candidate from "../Vote/Candidate";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';



function ElectionResult(props) {
  const { userId } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [student,setStudent] = useState("");
  const [studentList,setStudentList] = useState([]);
  const [isActive,setIsActive] = useState(false);
  const [isFinished,setIsFinished] = useState(false);



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

  const handlePastProcess = (e) =>{
    const formData = new FormData();
    formData.append("process", "DEPARTMENT_REPRESENTATIVE");
    
    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://iyte-election.azurewebsites.net/processes/started-process?${queryParams}`;
  
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
          setIsFinished(true);
        } else {
          // Handle 204 No Content response
          setIsFinished(false);
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
         
          setIsLoaded(true);
          setError(error);
        }
      );
  },[userId])
  
  useEffect(() => {
    handlePastProcess();
  }, [isFinished]);

  useEffect(()=>{
    handleActiveProcess();
  },[isActive])
  
  useEffect(()=>{
    if(student !== ""){
      const url = `https://iyte-election.azurewebsites.net/elections/results/`+student.department.id;
   
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
        setStudentList(data)  
      })
      .catch((err) => console.log(err));
    }
  },[student])

  if (error) {
    return <div>Error!..</div>;
  } else if (!isLoaded) {
    return (
      <Box sx={{ marginTop:"20%", display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );

  }else{

    if(!isActive && !isFinished){

      return(
        <Card className='candidacy-card' sx={{ marginTop: 15,borderRadius:5}}>
        <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
          <CardContent>
           <Typography sx={{textAlign:"center"}}>There is no active process at the moment, you can follow the announcements. </Typography>
           
          </CardContent>
        </CardActionArea>
      </Card>
      );

      
      } else {
        return (
          
            <div className="" style={{display:"flex !important",justifyContent:"center !important"}}>
              
                  <Typography sx={{textAlign:"center",marginTop:10}}><h1>DEPARTMENT REPRESENTATIVE</h1> </Typography>
              <div fixed="true" className="announcement">
                {studentList.map((candidate) => (
                  <Candidate key={candidate.candidate.id} numberOfVotes={candidate.numberOfVotes} isFinished={isFinished} type="election-result" student={candidate.candidate} userId={userId}/>
                ))}
              </div>
            </div>
            
        );
      }

  }

  
}

export default ElectionResult;