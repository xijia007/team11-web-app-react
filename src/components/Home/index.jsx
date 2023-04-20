import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../Firebase/firebase';
import JobsSideBar from '../JobsSideBar/index.jsx';
import ProfileCard from './ProfileCard.jsx';
import RecentJobLists from './recentJobLists/index.jsx';
import CompanyHome from '../CompanyHome/index.jsx';

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
  const isUser = role === 'user';
  const isCompany = role === 'company';

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        dispatch(removeCurrentUser());
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

  // useEffect(() => {
  //   async function fetchUsers() {
  //     const users = await findUsers();
  //     console.log(users);
  //   }

  //   async function fetchUser(uid) {
  //     const user = await findUser(uid);
  //     console.log(user);
  //   }

  //   fetchUsers();

  //   fetchUser('1EesaL499STDpjv6OzjV');
  // }, []);

  // const userEmail = auth().currentUser.email;
  // const isUserLoggedIn = auth?.currentUser;
  const email = auth?.currentUser?.email;
  // const { email } = user ?? undefined;
  console.log('email', email);

  return (
    <>
      {isUser && (
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
      )}
      {isCompany && (
        <nav>
          <h2>Welcome to LeanIn {email}</h2>
          <h3>Company home page</h3>
          <CompanyHome />
        </nav>
      )}
      {isAdmin && (
        <nav>
          <h2>Welcome to LeanIn {email}</h2>
          <h3>Admin home page</h3>
          <h3>Lists of Users</h3>
          <Admin />
        </nav>
      )}
    </>
  );
}

export default Home;
