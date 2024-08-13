import React, {useState,useEffect} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import "./Process.css"

function ProcessForm(props){
    const {userId} = props;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime,setStartTime] = useState("00:00")
    const [endTime,setEndTime] = useState("00:00")
    const [process,setProcess] = useState("");
    const [processNames,setProcessNames] = useState([]);

    const handleChangeStartDate = (e) => {
        console.log(e.target.value)
        setStartDate(e.target.value);
     
      };
    
      const handleChangeFinishDate = (e) => {
        setEndDate(e.target.value);
       
      };
    
      const handleSubmitProcess = (e) => {
        e.preventDefault();
        let startControlDate = new Date(startDate+"T"+startTime+":0").getTime();
        let endControlDate = new Date(endDate+"T"+endTime+":0").getTime();
        if(startControlDate > endControlDate){
          alert("Start date cannot be greater than end date!");
        }else if(process === "" ){
          alert("Please choose a process type!");
        }else if(startDate === "" || endDate === ""){
          alert("Please enter the dates!");
        }else{
            fetch("https://iyte-election.azurewebsites.net/processes", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                processType : process,
                startDate: startDate+"-"+startTime.replace(":","-")+"-0",
                endDate: endDate+"-"+endTime.replace(":","-")+"-0",
                administrationId: userId,
              }),
            })
              .then((res) => res.json())
              .catch((err) => console.log(err));
        
            setStartDate('');
            setEndDate('');
            setProcess('');
        }
      };

    const refreshProcessNames = () => {
        fetch("https://iyte-election.azurewebsites.net/process-types")
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
                setProcessNames(result);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        refreshProcessNames();
    }, [processNames]);

    return(

    <Card className='process-card'  sx={{ marginTop: 15, display: "flex", justifyContent: "center",borderRadius:5,width:"60%" }}>
        <CardActionArea disableTouchRipple disableRipple sx={{cursor:"default"}} >
          <CardContent sx={{ display: "block", justifyContent: "center" }}>
            <form>
            <div style={{textAlign:"center",justifyContent:"center",marginTop:20,marginLeft:"25%",width:"100%"}}>
            <Autocomplete
            disablePortal
            onChange={(e,value) => setProcess(value)}
            id="combo-box-demo"
            options={processNames}
            sx={{ width: "50%" }}
            renderInput={(params) => <TextField {...params} label="Process Types" />}
            />
            </div>
            <div style={{  }}>
                <h4 style={{marginBottom:5}}>Start Date</h4>
                <input
                  value={startDate}
                  type='date'
                  onChange={handleChangeStartDate}
                  style={{ width: "50%", height: 35,fontSize:18,textAlign:"center" }}
                />
                <input
                style={{ width: "50%", height: 35,fontSize:18,textAlign:"center" }}
                type='time'
                required
                onChange={(e) => {setStartTime(e.target.value)}}/>
              
              </div>
              <div style={{  }}>
                <h4 style={{marginBottom:5}}>Finish Date</h4>
                <input

                  value={endDate}
                  type='date'
                  onChange={handleChangeFinishDate}
                  style={{ width: "50%", height: 35,fontSize:18,textAlign:"center" }}
                />
                <input
                style={{ width: "50%", height: 35,fontSize:18,textAlign:"center" }}
                type='time'
                onChange={(e)=> setEndTime(e.target.value)}
                required/>
              </div>
           
            <div style={{ marginTop: 40,marginBottom: 20 }}>
              <Button
                onClick={handleSubmitProcess}
                sx={{ width: "70%", height:45, backgroundColor: '#B61815' ,fontWeight:"Bold"}}
                variant="contained"
              >
                ADD PROCESS
              </Button>
            </div>

            </form>

          </CardContent>
        </CardActionArea>
      </Card>
    );

}
export default ProcessForm;