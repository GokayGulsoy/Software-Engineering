import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function DocumentView(props) {
  const { document,approveCount,setApproveCount } = props;
  const [fileDisplay, setFileDisplay] = useState(null);
  const [editControlStatus,setEditControlStatus] = useState(document.controlStatus);

  const convertBase64ToFile = (base64String, fileName) => {
    const contentType = 'application/pdf'; // Update the content type as per your file type
    const sliceSize = 1024;
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    const file = new File([blob], fileName, { type: contentType });
    setFileDisplay(file);
  };

  useEffect(() => {
    if (document.file) {
      convertBase64ToFile(document.file.content, document.file.name);
    }
  }, [document]);

  const handleApprove = (e) =>{
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("controlStatus", "APPROVED");

    fetch("https://iyte-election.azurewebsites.net/document/update-control-status/"+document.id, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((response)=>{
        console.log(response)
        setEditControlStatus(response.controlStatus);
        setApproveCount(approveCount+1);
        
      })
      .catch((err) => console.log(err));
          

  }
  const handleDenied = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("controlStatus", "DENIED");

    fetch("https://iyte-election.azurewebsites.net/document/update-control-status/"+document.id, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((response)=>{
        console.log(response)
        setEditControlStatus(response.controlStatus);
      })
      .catch((err) => console.log(err));
      
  }

  const handleUnacceptable = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("controlStatus", "UNACCEPTABLE");

    fetch("https://iyte-election.azurewebsites.net/document/update-control-status/"+document.id, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((response)=>{
        console.log(response)
        setEditControlStatus(response.controlStatus);
      })
      .catch((err) => console.log(err));
      
      
  }
  

  return (
    <div className='' style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
      <Card className='' sx={{ marginBottom: 2, width: "90%",maxWidth:"600px",borderRadius:5 }}>
        <CardActionArea disableTouchRipple disableRipple sx={{ cursor: "default", justifyContent: "center" }}>
          <CardContent>
        
            <div style={{ marginBottom: 5 ,display:"flex",justifyContent:"center"}}>
             <span style={{marginLeft:"32%",marginTop:8,textAlign:"center"}}> {document.document.replace("_", " ")}</span>
            {(editControlStatus === "APPROVED" ) ? 
            
            (<Button disabled={true} sx={{padding:0,marginLeft:"18%"}}>
                <DoneIcon sx={{color:"green",fontSize:"25px",marginLeft:4}} />
                </Button>):
            
            ((editControlStatus === "DENIED") ? 
                (<Button disabled={true}  sx={{padding:0,marginLeft:"18%"}}>
                    <WarningAmberIcon sx={{color:"yellow",fontSize:"25px",marginLeft:4}} />
                    </Button>) : 
                ((editControlStatus === "UNACCEPTABLE")?(
                  <Button disabled={true}  sx={{padding:0,marginLeft:"18%"}}>
                    <CloseIcon sx={{color:"red",fontSize:"25px",marginLeft:4}} />
                    </Button>
                ):(<div>
                    <Button onClick={handleApprove} sx={{padding:0,marginLeft:"18%"}}>
                        <DoneIcon sx={{color:"black",fontSize:"25px"}} /></Button>
                    <Button onClick={handleDenied}  sx={{padding:0,marginLeft:"18%"}}>
                        <WarningAmberIcon sx={{color:"black",fontSize:"25px"}} /></Button>
                    <Button onClick={handleUnacceptable}  sx={{padding:0,marginLeft:"18%"}}>
                        <CloseIcon sx={{color:"black",fontSize:"25px"}} /></Button>
                </div>)))} 
            
           
            </div>
            <div style={{marginBottom:15}}>
              {fileDisplay && (
                <a href={URL.createObjectURL(fileDisplay)} target="_blank" rel="noopener noreferrer">
                  {fileDisplay.name}
                </a>
              )}
            </div>
            <div style={{ marginLeft:"40%",width:100 ,textAlign: "center",border:"1px solid",borderRadius:5,padding:5 }}>
              {document.controlStatus}
            </div>
            
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default DocumentView;