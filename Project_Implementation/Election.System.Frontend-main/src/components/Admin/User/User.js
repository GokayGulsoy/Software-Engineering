import React,{useState,useEffect}from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea } from '@mui/material';
import './User.css'
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';



function User(props)
{
    const {studentId,username,firstName,lastName,department,gpa,gender,role} = props;
    const [isEdit,setIsEdit] = useState(false);
    const [isDetailed,setIsDetailed] = useState(false);
    const [editRole,setEditRole] = useState(role);
    const [roles ,setRoles] = useState([]);
    const refreshRoles = () => {
        fetch("https://iyte-election.azurewebsites.net/roles")
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
                setRoles(result);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        refreshRoles();
    }, [roles]);
    
    const handleEdit = (e) =>{
        setIsEdit(true);

    }
    const handleDetail = (e) =>{
        setIsDetailed(!isDetailed);

    }
    const handleSave = (e) => {
      e.preventDefault();
      fetch("https://iyte-election.azurewebsites.net/administrations/authorization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          role: editRole,
          
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));
        setIsEdit(false);
        
  
  
    };
    const handleCancel = (e) => {
        setIsEdit(false);
        setEditRole(role);

    }
    if(isEdit){
        return (
            <Card  id={studentId} sx={{ display: "block",marginTop: 10,margin:10,width:"30%",height:"auto",marginRight:"30%",marginLeft:"30%",borderRadius:3}}>
              <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                <CardContent>
                  <Typography sx={{justifyContent:"center",marginBottom:2}} gutterBottom variant="h5" component="div">
                    {firstName+" "+lastName}
                  </Typography>
                  <Typography sx={{justifyContent:"center",marginBottom:2}} variant="body2" color="text.secondary">
                    {username}
                  </Typography>
                  <div style={{textAlign:"center",justifyContent:"center",marginTop:20,marginLeft:"10%",width:"100%"}}>
                  <Autocomplete

                    onChange={(e,value) => setEditRole(value)}
                    id="combo-box-demo"
                    options={roles}
                    sx={{ width: "80%" }}
                    renderInput={(params) => <TextField {...params} label="Student Role" />}
                />
            </div>
            <div className="buttons" style={{display: "flex",justifyContent:"center",marginTop:30,marginBottom:20}}>
              <Button onClick={handleSave} variant='contained' sx={{width:"30%",marginRight:3,backgroundColor:"#B61815"}}>Save</Button>
              <Button onClick={handleCancel} variant='contained'sx={{width:"30%",marginLeft:3,backgroundColor:"#B61815"}}>Cancel</Button>
              </div>
                  
                </CardContent>
              </CardActionArea>
            </Card>
          );

    }else if(isDetailed){
        return (
            <Card  id={studentId} sx={{ marginTop: 10,marginBottom:10,width:"40%",marginRight:"30%",marginLeft:"30%",borderRadius:3}}>
              <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
                <CardContent>
                  <Typography sx={{justifyContent:"center",marginBottom:2}} gutterBottom variant="h5" component="div">
                    {firstName+" "+lastName}
                  </Typography>
                  <div className='profile-body'>
                    <div className='profile-element'> <h4>Username</h4> <Typography  variant="body2" color="text.secondary">{username}</Typography></div>
                    <div className='profile-element'> <h4>Gender</h4> <Typography  variant="body2" color="text.secondary">{gender}</Typography></div>
                    <div className='profile-element'> <h4>GPA</h4> <Typography  variant="body2" color="text.secondary">{gpa}</Typography></div>
                    <div className='profile-element'> <h4>Department</h4> <Typography  variant="body2" color="text.secondary">{department}</Typography></div>
                    <div className='profile-element'> <h4>Role</h4><Typography  variant="body2" color="text.secondary">{editRole.replace("_"," ")}</Typography></div>
                  </div>
                  <div style={{marginTop:10,justifyContent:"space-between",display:"flex"}}>
                  <Button sx={{fontSize:11}} size="small" onClick={handleDetail}>Close</Button>
                  </div>
                 
                </CardContent>
              </CardActionArea>
            </Card>
          );

    }else{
    return (
      <Card  id={studentId} sx={{ marginTop: 10,marginBottom: 5,marginRight:5,marginLeft:5,width:"31%",borderRadius:3}}>
        <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
          <CardContent>
            <Typography sx={{justifyContent:"center",marginBottom:2}} gutterBottom variant="h5" component="div">
              {firstName+" "+lastName}
            </Typography>
            <Typography sx={{justifyContent:"center",marginBottom:2}} variant="body2" color="text.secondary">
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editRole.replace("_"," ")}
            </Typography>
            <div style={{marginTop:10,justifyContent:"space-between",display:"flex"}}>
            <Button onClick={handleDetail} sx={{fontSize:13}} size="small">Detail</Button>
            <Button onClick={handleEdit}><EditIcon sx={{color:"black",fontSize:"25px",marginLeft:2}} /></Button>
            </div>
           
          </CardContent>
        </CardActionArea>
      </Card>
    );
    }
}

export default User;