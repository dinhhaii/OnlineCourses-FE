import React from 'react';
import Auth from '../pages/Auth';
import Login from '../components/auth/login';
import Register from '../components/auth/register';
import ForgotPassword from '../components/auth/forgot-password';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
// import App from '../App';

// Main routes
const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Home />,
  },
  {
    path: '/auth',
    exact: false,
    component: () => (
      <Auth
        routes={[
          {
            path: '/auth/login',
            exact: false,
            component: () => <Login />,
          },
          {
            path: '/auth/register',
            exact: false,
            component: () => <Register />,
          },
          {
            path: '/auth/forgot-password',
            exact: false,
            component: () => <ForgotPassword />,
          },
        ]}
      />
    ),
  },
  {
    path: '',
    exact: false,
    component: () => <NotFound />,
  },
];

export default routes;
