import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAuthContext } from '@/contexts/auth';

import { PublicRoutes } from './public';
import { AdminRoutes } from './admin';

export const RouterManager = () => {
  const { user } = useAuthContext();

  return <BrowserRouter>{user !== null ? <AdminRoutes /> : <PublicRoutes />}</BrowserRouter>;
};
