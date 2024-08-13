import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login (props)  
{
  const navigate = useNavigate();
  const{setUserId, setRole} = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => 
  {
    e.preventDefault();
    fetch("https://iyte-election.azurewebsites.net/login",
    {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body : JSON.stringify({
        username : email,
        password : password,
      }),    
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.userId != null){
        setUserId(res.userId);
        setRole(res.role);
        if(res.role ==="STUDENT"|| res.role === "DEPARTMENT_REPRESENTATIVE"){
          navigate("/home");
        }else if(res.role === "STUDENT_AFFAIR"){
          navigate("/announcements");
        }
        
      } else {
        alert(res.message);
      }
    })
    .catch((err) => console.log(err))
  };

  return (
    <div className="login-page">
      <div className="login-head">
        <h2>IYTE Election System</h2>
        
      </div>
      <p style={{fontSize:"12px",marginBottom:"20px"}}>Please enter your IYTE Zimbra mail and password to login.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
         
          <input
          placeholder="Username"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">LOGIN</button>
        <div style={{marginTop:5,marginRight:5,display:"flex",justifyContent:"right"}}><a href="https://mail-app.iyte.edu.tr/ForgotMyPassword/"> Forget Password</a></div>
      </form>
    </div>
  );
};

export default Login;