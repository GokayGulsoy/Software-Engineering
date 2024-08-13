import React,{useState,useEffect}from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';
import DocumentView from './DocumentView';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function CandidacyApplication(props)
{
    const {student} = props;
    const [documents, setDocuments] = useState([]);
    const [isDetailed,setIsDetailed] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);
    const [approveCount,setApproveCount] = useState(0)
    const [isCandidate,setIsCandidate] = useState(false);
    

    const checkIsCandidate = () =>{
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
          data.forEach((element)=>{
            if(element.id === student.id){
              setIsCandidate(true);
            }
          })
          
          
        })
        .catch((err) => console.log(err));

       
    }

    const handleDetail = (e) =>{
    
      setIsDetailed(true);
        
    };
  useEffect(()=>{
    
    fetch("https://iyte-election.azurewebsites.net/documents/department-candidacy/"+student.id)
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
            setDocuments(result);
            console.log(result);
            
            var count = 0;
            documents.forEach((element) => {
              if(element.controlStatus === "APPROVED" ){
                  count++;
              }
              
            });
            
            setApproveCount(count);
            setIsLoaded(true);   
        },
          (error) => {
              console.log(error);
          }
      ) 
  },[isDetailed])

 

  const handleAddCandidate = (e) =>{
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("process","DEPARTMENT_CANDIDACY");
    
        fetch("https://iyte-election.azurewebsites.net/candidates/"+student.id, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((response)=>{
            console.log(response)
            
          })
          .catch((err) => console.log(err));
        setIsCandidate(true);
    
   
    }
  const handleCloseDetail = (e) =>{
      setIsDetailed(false);
    }

  const handleCancel = (e) => {
     
      fetch("https://iyte-election.azurewebsites.net/candidates/"+student.id,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id : student.id,
          }),
        })
        .then((res) => res.json())
        .then((result) =>{
          setIsCandidate(false);
        })
        .catch((err) => {
          // Handle any errors
          console.log(err);
        });
        
        
    };


    useEffect((e) =>{
      checkIsCandidate();
    },[isCandidate])

    if(isDetailed){
        return (
            <Card  id={student.id} sx={{ marginTop: 10,marginBottom:10,width:"51%",marginRight:"25%",marginLeft:"25%",borderRadius:5}}>
              <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                {(isLoaded) ? ( <CardContent>
                  <Typography sx={{display:"flex",justifyContent:"center",marginTop:2,marginBottom:2}} gutterBottom variant="h5" component="div">
                    {student.firstName+" "+student.lastName}
                  </Typography>
                  <div >
                    {documents.map((document) =>(
                      <DocumentView 
                        document={document} 
                        studentId={student.id}
                        approveCount={approveCount}
                        setApproveCount={setApproveCount}/>
                    ))}
                   
                  </div>
                  {(approveCount === documents.length && !isCandidate)? (
                    <div style={{marginTop:10,justifyContent:"space-between",display:"flex"}}>
                    <Button sx={{fontSize:11}} size="small" onClick={handleCloseDetail}>Close</Button>
                    <Button onClick={handleAddCandidate} variant='contained'>ADD CANDIDATE</Button>
                    </div>
                  ) : ((isCandidate) ? (<div style={{marginTop:10,justifyContent:"space-between",display:"flex"}}>
                  <Button sx={{fontSize:11}} size="small" onClick={handleCloseDetail}>Close</Button>
                  <div>
                  <Button disabled={true} >APPROVED</Button>
                  <Button 
                    onClick={handleCancel}
                    variant='contained' 
                    sx={{backgroundColor:"#B61815"}}
                    >CANCEL</Button>
                  </div>
                  
              </div>) : (<div style={{marginTop:10,justifyContent:"space-between",display:"flex"}}>
              <Button sx={{fontSize:11}} size="small" onClick={handleCloseDetail}>Close</Button>
              <Button disabled={true} >DENIED</Button>
          </div>)
                    
                  )}
                  
                 
                </CardContent>

                ) : (
                  <Box sx={{ display: 'flex' ,textAlign: 'center',justifyContent:'center'}}>
                <CircularProgress />
                 </Box>
                )}
                
              </CardActionArea>
            </Card>
          );

    }else{
      
    return (
    
      <Card  id={student.id} sx={{ border: isCandidate ? "1px solid" : "", borderColor:"green",display:"flex",marginTop: 10,marginBottom: 0,marginRight:5,marginLeft:5,width:"31%",borderRadius:3,justifyContent:"center",textAlign:"center"}}>
        <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
          <CardContent>
            <Typography sx={{justifyContent:"center",marginBottom:2}} gutterBottom variant="h5" component="div">
              {student.firstName+" "+student.lastName}
            </Typography>
            <Typography sx={{justifyContent:"center",marginBottom:2}} variant="body2" color="text.secondary">
              {student.username}
            </Typography>
            <div style={{marginTop:10,justifyContent:"space-between",display:"flex"}}>
            <Button onClick={handleDetail} sx={{fontSize:13}} size="small">Detail</Button>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    );
    }
}

export default CandidacyApplication;