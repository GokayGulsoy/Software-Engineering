import React, { useEffect, useState } from 'react';
import './Profile.css';

function Profile(props) {

  const userId = props.userId;
  const role = props.role;
  var link;
  const [user, setUser] = useState(null);
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  if( role ==="STUDENT" || role === "DEPARTMENT_REPRESENTATIVE"){
    link = "students"
  }else if(role ==="STUDENT_AFFAIR"){
    link = "administrations"
  }

  const refreshUserId = () => {

    return fetch("https://iyte-election.azurewebsites.net/"+link+"/" + userId)
    .then((res) => {
      if (res.status === 204) {
        // Handle 204 No Content response
        return Promise.resolve(null);
      } else {
        return res.json();
      }
    })
      .then(
        (user) => {
          setIsLoaded(true);
          setUser(user);
        },
        (error) => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );
  };
  
  useEffect(() => {
    refreshUserId();
  }, [userId]);

  if(user != null){
    if(role === "STUDENT" || role === "DEPARTMENT_REPRESENTATIVE"){
    return (
      <div className="profile-container">
        <div className="profile-header">
          {
            user.middleName === null ? 
            (<h1>{user.firstName + " " + user.lastName}</h1>) : 
            (<h1>{user.firstName + " " + user.middleName + " " + user.lastName}</h1>)
          }
        </div>
        <div className="profile-body">
          <div className='profile-element'> <h4>Username</h4> <p> {user.username}</p></div>
          <div className='profile-element'> <h4>Gender</h4> <p> {user.gender}</p></div>
          <div className='profile-element'> <h4>GPA</h4> <p> {user.gpa}</p></div>
          <div className='profile-element'> <h4>Department</h4> <p> {user.department.name}</p></div>
          <div className='profile-element'> <h4>Faculty</h4> <p> {user.department.faculty.name}</p></div>
          
        </div>
      </div>
    );
        }else if(role === "STUDENT_AFFAIR"){
          return (
            <div className="profile-container">
              <div className="profile-header">
                {
                  user.middleName === null ? 
                  (<h1>{user.firstName + " " + user.lastName}</h1>) : 
                  (<h1>{user.firstName + " " + user.middleName + " " + user.lastName}</h1>)
                }
              </div>
              <div className="profile-body">
                <div className='profile-element'> <h4>Username</h4> <p> {user.username}</p></div>
                <div className='profile-element'> <h4>Gender</h4> <p> {user.gender}</p></div>
                
              </div>
            </div>
          );

        }
  }
}

export default Profile;