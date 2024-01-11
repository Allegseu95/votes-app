import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from '@/pages/public/Login';

export const PublicRoutes = () => (
  <Routes>
    <Route path='/' element={<LoginPage />} />
    <Route path='*' element={<Navigate to='/' />} />
  </Routes>
);
