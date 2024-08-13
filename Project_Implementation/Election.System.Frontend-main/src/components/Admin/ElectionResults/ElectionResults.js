import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Candidate from "../../Student/Vote/Candidate";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";



function ElectionResults(props) {
  const { userId } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [student,setStudent] = useState("");
  const [studentList,setStudentList] = useState([]);
  const [isActive,setIsActive] = useState(false);
  const [isFinished,setIsFinished] = useState(false);
  const [department,setDepartment] = useState("");
  const [departmentId,setDepartmentId] = useState(0);
  const [departments,setDepartments] = useState([]);
  const [departmentsName,setDepartmentsName] = useState([]);


  useEffect(() =>{
    fetch("https://iyte-election.azurewebsites.net/departments", {
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
          setDepartments(data);
          setIsLoaded(true)
          let departmentName = [];
          data.forEach(element => {
            departmentName.push(element.name);
          });
          setDepartmentsName(departmentName);
        })
        .catch((err) => console.log(err));


  },[])



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


  
  useEffect(() => {
    handlePastProcess();
  }, [isFinished]);

  useEffect(()=>{
    handleActiveProcess();
  },[isActive])

  
  useEffect(()=>{
    setIsLoaded(false);
    
    if(department !== "" && departments.length !== 0){
      const url = `https://iyte-election.azurewebsites.net/elections/results/`+departments[departmentsName.indexOf(department)].id;
   
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
        console.log(data);
        setIsLoaded(true);
        
        
      })
      .catch((err) => console.log(err));
      console.log(studentList)
      
    }
  },[department])


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
                  <div style={{display:"flex",textAlign:"center",justifyContent:"center",marginTop:20,width:"100%"}}>
            <Autocomplete
                    
                    disablePortal
                    onChange={(e,value) => setDepartment(value)}
                    id="combo-box-demo"
                    options={departmentsName}
                    sx={{ width: "40%",backgroundColor:"white" }}
                    renderInput={(params) => <TextField {...params} label="Choose a department" />}
                    />
            </div>
            {(studentList.length !== 0) ? (<div fixed="true" className="announcement">
                
                { studentList.map((candidate) => (
                  <Candidate key={candidate.candidate.id} numberOfVotes={candidate.numberOfVotes} isFinished={isFinished} type="election-result" student={candidate.candidate} userId={userId}/>
                ))}
              </div>) : (<div fixed="true" className="announcement">
              <Card className='candidacy-card' sx={{ marginTop: 15,borderRadius:5}}>
                <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                <CardContent>
                <Typography sx={{textAlign:"center"}}>There is no election results for this department.</Typography>
                
                </CardContent>
                </CardActionArea>
            </Card>
              </div>)}
                
            </div>
            
        );
      }

  }

  
}

export default ElectionResults;