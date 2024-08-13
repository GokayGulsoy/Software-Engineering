import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import User from "./User";
import { Button } from "@mui/material";

import './UsersPage.css';

function UsersPage(props) {
  const { userId } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentList, setStudentList] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Perform search logic here
    console.log('Searching for:', searchTerm);
    // Reset the search term
    setSearchTerm('');
  };

  const refreshPosts = () => {
    fetch("https://iyte-election.azurewebsites.net/students")
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
          setIsLoaded(true);
          setUserList(result);
          setStudentList(result);
        },
        (error) => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  useEffect(() => {
    const newArray = userList.filter((user) =>
      user.username.includes(searchTerm)
    );
    setStudentList(newArray);
  }, [searchTerm, userList]);

  if (error) {
    return <div>Error!..</div>;
  } else if (!isLoaded) {
    return (
      <Box sx={{ marginTop:"30%",display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <div className="container-user">
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              style={{ width: "30%", marginLeft: "35%", height: "30px", marginTop: "5%", justifyContent: "center" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button  disabled={true} type="submit">
              <SearchIcon sx={{fontSize:31}} />
            </Button>
          </form>
        </div>

        <div className="container-user">
          <div fixed="true" className="announcement">
            {studentList.map((student) => (
              <User
                key={student.id}
                userId={userId}
                studentId={student.id}
                username={student.username}
                firstName={student.firstName}
                lastName={student.lastName}
                department={student.department.name}
                gpa={student.gpa}
                role={student.role}
                gender={student.gender}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default UsersPage;
