import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../Firebase/firebase';
import JobsSideBar from '../JobsSideBar/index.jsx';
import ProfileCard from './ProfileCard.jsx';
import RecentJobLists from './recentJobLists/index.jsx';

import {
  findUsers,
  findUser,
  removeCurrentUser,
} from '../../services/user-service';
import Admin from '../Admin/index.jsx';

function Home() {
  const { user } = useSelector((state) => state.userInfo);
  const { role } = user;
  const isAdmin = role === 'admin';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        // dispatch(removeCurrentUser());
        localStorage.removeItem('userData');
        navigate('/');
        console.log('Signed out successfully');
      })
      .catch((error) => {
        console.error(error);
        // An error happened.
      });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const { email } = user;
        // ...
        console.log('email', email);
      } else {
        // User is signed out
        // ...
        console.log('user is logged out');
      }
    });
  }, []);

  const email = auth?.currentUser?.email;
  // const { email } = user ?? undefined;
  console.log('email', email);

  return (
    <nav>
      <h2>Welcome to LeanIn {email}</h2>
      <div className="row mt-2">
        <div className="col-2 col-md-2 col-lg-1 col-xl-2">
          <ProfileCard />
        </div>
        <div
          className="col-9 col-md-10 col-lg-7 col-xl-6"
          style={{ position: 'relative' }}
        >
          <RecentJobLists />
        </div>
        <div className="col-3 col-lg-2 col-xl-4">
          <JobsSideBar />
        </div>
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Home;
