import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import "./Candidacy.css"



function Document(props){
    const {userId,isSent,documentType,documentCount,setDocumentCount} = props;
    const [file,setFile] = useState("");



    const handleFile = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        // Check file size
        const fileSizeLimit = 5 * 1024 * 1024; // 5MB in bytes
        if (selectedFile.size <= fileSizeLimit) {
          setFile(selectedFile);
          
          if (file === "") {
            setDocumentCount(documentCount + 1);
          }
        } else {
          // File size exceeds the limit
          alert("File size exceeds the limit of 5MB.");
        }
      }
    };

    const  handleApply = ()=>{
      
      const formData = new FormData();
      formData.append("StudentId", userId);
      formData.append("Process", "DEPARTMENT_REPRESENTATIVE");
      formData.append("Document", documentType);
      formData.append("File", file);

      fetch("https://iyte-election.azurewebsites.net/documents", {
        method: "POST",
        body: formData
      })
        .then((res) => res.json()) 
        .then((data) => {
          console.log(data);
          
        })
        .catch((err) => console.log(err));
    }
    useEffect(() =>{
        if(isSent){
            handleApply();
        }

    },[isSent]);
    
          return (

          <div className='' style={{textAlign:"center",display:"flex",justifyContent:"center"}}>
              <Card className=''  sx={{ marginBottom: 2,borderRadius:0}}>
              <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default",justifyContent:"center"}} >
                <CardContent>
                  <div style={{textAlign:"center"}}>
                  
                      <input 
                        required 
                        onChange={handleFile} 
                        disabled={false} 
                        type="file" 
                        name="archive" 
                        accept=".pdf" 
                        style={{color:"white",margin:0,width:"40%",marginLeft:"10%"}}/>
                        <p>{(file === "" ) ? "Choose a file":file.name }</p>
                      
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>

          </div>
            
          );
      
}

export default Document;