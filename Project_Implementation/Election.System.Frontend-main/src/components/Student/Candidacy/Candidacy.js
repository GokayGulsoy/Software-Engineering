import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import "./Candidacy.css"
import Button from '@mui/material/Button';
import Document from './Document';
import DocumentView from './DocumentView';


function Candidacy(props){
    const {userId} = props;
    const [isActive,setIsActive] = useState(false);
    const [isApply,setIsApply] = useState(false);  
    const [isFuture,setIsFuture] = useState(false);
    const [isSent,setIsSent] = useState(false);
    const [documents,setDocuments] = useState([]);
    const [futureProcess,setFutureProcess] = useState();
    const [documentCount,setDocumentCount] = useState(0);
    const [documentTypes,setDocumentTypes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isUnacceptable,setIsUnacceptable] = useState(false);
    
    

    const handleProcessesFuture = (e) =>{
        const formData = new FormData();
        formData.append("process", "DEPARTMENT_CANDIDACY");
        
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

    const  handleApply = ()=>{
        if(documentCount===4){
          alert("Success");
          setIsSent(true);
          
        }else{
          alert("Please upload all of the file.")
        }
        
      
    }

    useEffect(()=>{
      fetch("https://iyte-election.azurewebsites.net/document-types")
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
                setDocumentTypes(result);
            },
            (error) => {
                console.log(error);
            }
        )

    },[])

    useEffect(()=>{
      fetch("https://iyte-election.azurewebsites.net/documents/department-candidacy/"+userId)
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
                setIsLoaded(true);
                result.forEach(element => {
                  if(element.controlStatus === "UNACCEPTABLE"){
                    setIsUnacceptable(true);
                  };
                  
                });
            },
            (error) => {
                console.log(error);
            }
        )
        if(documents.length !== 0){

            setIsApply(true);
        }
    },[userId,documents])


    useEffect(()=>{
      const formData = new FormData();
        formData.append("process", "DEPARTMENT_CANDIDACY");
        
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
              handleProcessesFuture();
            }
          })
          .catch((err) => console.log(err));
    },[documents])


    if(!isLoaded){
      return (
          <Box sx={{ marginTop:"20%",display: 'flex' ,textAlign: 'center',justifyContent:'center'}}>
              <CircularProgress />
          </Box>
      );
  }
  else if(isApply && isLoaded && isActive){
    return(<div className='container'>
    <Card  sx={{ marginTop: 15,borderRadius:5,width:"50%",marginLeft:"25%"}}>
    <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
      <CardContent>
        <Typography sx={{textAlign:"center",marginTop:2}} gutterBottom variant="h5" component="div">
          Documents for Departmental Representative Candidacy
        </Typography>
        <br />
        <Typography variant="body2" color="text.secondary" sx={{textAlign:"center",marginBottom:2}}>
          Your application has been sent, you can view its status.
        </Typography>
       
        {documents.map((document)=>(
            <div style={{display:"block",justifyContent:"center"}}>
                <DocumentView isUnacceptable={isUnacceptable} userId={userId} document={document}></DocumentView>
            </div>
            )

        )}
        
      </CardContent>
    </CardActionArea>
  </Card>

</div>);
  }else{
   if(isActive){
    
          return (

          <div className='container'>
              <Card className='candidacy-card' sx={{ marginTop: 15,borderRadius:5}}>
              <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                <CardContent>
                  <Typography sx={{textAlign:"center"}} gutterBottom variant="h5" component="div">
                    Documents for Departmental Representative Candidacy
                  </Typography>
                  <br />
                  <Typography variant="body2" color="text.secondary"textAlign="center">
                    In order to be a department candidate, you must upload the following files to the system in pdf format.
                  </Typography>
                  <br/> 
                  <form>
                    {documentTypes.map((document)=>(
                      <div>
                      <Typography sx={{textAlign:"center"}} variant="body2" color="text.secondary">
                        {document.replace("_"," ")}
                      </Typography>
                        <Document 
                          
                          isSent={isSent} 
                          userId={userId} 
                          documentCount={documentCount} 
                          setDocumentCount={setDocumentCount} 
                          documentType={document}></Document>
                      </div>
                    )

                    )}
                
                  <br />
                  <Button onClick={handleApply} sx={{width:"18%", marginLeft: "41%",backgroundColor: "#B61815"}} variant='contained'>APPLY</Button>
                  </form>
                </CardContent>
              </CardActionArea>
            </Card>

          </div>
            
          );
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

      
    
}

export default Candidacy;