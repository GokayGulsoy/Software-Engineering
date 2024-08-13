import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import "./Candidacy.css"
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

function DocumentView(props) {
  const { userId, document, isUnacceptable } = props;
  const [fileDisplay, setFileDisplay] = useState(null);
  const [file,setFile] = useState(null);
  const [isEdit,setIsEdit] = useState(false);

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

  const handleEdit = (e) =>{
    setIsEdit(true);
  }
  const  handleApply = ()=>{
    if(file === null){
        alert("Please fill on the file")
    }else{
    const formData = new FormData();
    formData.append("file", file);

    fetch("https://iyte-election.azurewebsites.net/documents/"+document.id, {
      method: "PUT",
      body: formData
    })
      .then((res) => res.json()) 
      .then((data) => {
        
        alert("Document sent succesfully!");
        setIsEdit(false);
      })
      .catch((err) => console.log(err));
    }
  }

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    
  };

  

  useEffect(() => {
    if (document.file) {
      convertBase64ToFile(document.file.content, document.file.name);
    }
  }, [document,isEdit]);

  if(!isEdit){
    return (
      <div className='' style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
        <Card className='' sx={{ marginBottom: 2, borderRadius: 0, width: "90%",maxWidth:"600px" }}>
          <CardActionArea disableTouchRipple disableRipple sx={{ cursor: "default", justifyContent: "center" }}>
            <CardContent>
          
              <div style={{ marginBottom: 5 ,display:"flex",justifyContent:"center"}}>
               <span style={{marginLeft:"32%",marginTop:8,textAlign:"center"}}> {document.document.replace("_", " ")}</span>
              {(document.controlStatus === "APPROVED") ? 
              
              (<Button disabled={true} sx={{padding:0,marginLeft:"18%"}}><DoneIcon sx={{color:"green",fontSize:"25px"}} /></Button>):
              
              ((isUnacceptable) ? (<Button disabled={true} onClick={handleEdit}  sx={{padding:0,marginLeft:"18%"}}><CloseIcon sx={{color:"black",fontSize:"25px"}} /></Button>) :
               (<Button onClick={handleEdit}  sx={{padding:0,marginLeft:"18%"}}><EditIcon sx={{color:"black",fontSize:"25px"}} /></Button>))} 
              
             
              </div>
              <div style={{marginBottom:15}}>
                {fileDisplay && (
                  <a href={URL.createObjectURL(fileDisplay)} target="_blank" rel="noopener noreferrer">
                    {fileDisplay.name}
                  </a>
                )}
              </div>
              <div style={{ marginLeft:"35%",width:"30%", textAlign: "center",border:"1px solid",borderRadius:5,padding:5 }}>
                {document.controlStatus}
              </div>
              
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );

  }else{
    return (

      <div className='' style={{textAlign:"center",display:"flex",justifyContent:"center"}}>
          <Card className=''  sx={{ marginBottom: 2, borderRadius: 0, width: "90%",maxWidth:"600px" }}>
          <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default",justifyContent:"center"}} >
            <CardContent>
            <div style={{ marginBottom: 5 ,display:"flex",justifyContent:"center"}}>
            <span style={{marginBottom:8,marginTop:8,textAlign:"center"}}> {document.document.replace("_", " ")}</span>
            </div>
            <form onSubmit={handleApply}>
            <div style={{display:"flex",justifyContent:"center",width:"100%",marginLeft:"10%"}}>
              
              <input  style={{width:"80%"}} required={true} onChange={handleFile} disabled={false} type="file" name="archive" accept=".pdf" />
            </div>
            <div>
              <Button onClick={(e) => setIsEdit(false)}>Cancel</Button>
              <Button onClick={handleApply}>Send</Button>
            </div>
            </form>
              
              
            </CardContent>
          </CardActionArea>
        </Card>

      </div>
        
      );
  }
  
}

export default DocumentView;


