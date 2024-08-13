import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/Navbar';
import Login from './components/Login/Login'
import Home from './components/Student/Home/Home'
import Vote from './components/Student/Vote/Vote'
import Candidacy from './components/Student/Candidacy/Candidacy'
import Profile from './components/Profile/Profile'
import AnnouncementPage from './components/Admin/Announcement/AnnouncementPage'
import CandidacyAppPage from './components/Admin/CandidacyApplication/CandidacyAppPage';
import ProcessPage from './components/Admin/Processes/ProcessPage';
import UsersPage from './components/Admin/User/UsersPage';
import { useState } from 'react';
import ElectionResult from './components/Student/ElectionResult/ElectionResult';
import ElectionResults from './components/Admin/ElectionResults/ElectionResults';
import Operations from './components/Admin/Operations/Operations';

function App() 
{

  const[userId, setUserId] = useState(0);
  const[role, setRole] = useState(null);

  if(userId === 0){
    return (
      
      <BrowserRouter>
      
        <Routes>
          <Route exact path='/' element={<Login setUserId={setUserId} setRole={setRole} role={role} />}  />
        </Routes>
        
      </BrowserRouter>
    );
  } else if(role === "STUDENT" || role === "DEPARTMENT_REPRESENTATIVE") {
    return (
      <div className="App">
        
        <BrowserRouter>
        <NavBar setUserId={setUserId} userId={userId} role={role} />
          <Routes>
            <Route exact path='/home' element={<Home />}/>
            <Route exact path='/voting' element={<Vote userId={userId}/>}/>
            <Route exact path='/candidacy-application' element={<Candidacy userId={userId}/>}/>
            <Route exact path='/profile' element={<Profile userId={userId} role={role} />}/>
            <Route exact path='/election-result' element={<ElectionResult userId={userId}/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }else if(role === "STUDENT_AFFAIR"){
    return (
      <div className="App">
        
        <BrowserRouter>
        <NavBar setUserId={setUserId} userId={userId} role={role} />
          <Routes>
            <Route exact path='/announcements' element={<AnnouncementPage userId={userId} />}/>
            <Route exact path='/processes' element={<ProcessPage/>}/>
            <Route exact path='/applications' element={<CandidacyAppPage userId={userId} />}/>
            <Route exact path='/users' element={<UsersPage/>}/>
            <Route exact path='/profile' element={<Profile userId={userId} role={role}/>}/>
            <Route exact path='/election-results' element={<ElectionResults userId={userId} role={role}/>}/>
            <Route exact path='/operations' element={<Operations userId={userId} />}/>
            
          </Routes>
        </BrowserRouter>
      </div>
    );

  }
}

export default App;
