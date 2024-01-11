import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardPage } from '@/pages/admin/Dashboard';
import { RequestsPage } from '@/pages/admin/Requests';
import { ObserversPage } from '@/pages/admin/Observers';
import { BallotsPage } from '@/pages/admin/Ballots';
import { CandidatesPage } from '@/pages/admin/Candidates';
import { JRVSPage } from '@/pages/admin/JRVS';
import { VerificationPage } from '@/pages/admin/Verification';

import { CustomSidebar } from '@/components/Sidebar';

export const AdminRoutes = () => (
  <div className='dark:bg-gray-500 h-screen overflow-auto'>
    <CustomSidebar />

    <div className='p-0 py-3 sm:p-5 sm:py-0 sm:ml-64'>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/solicitudes' element={<RequestsPage />} />
        <Route path='/observadores' element={<ObserversPage />} />
        <Route path='/papeletas' element={<BallotsPage />} />
        <Route path='/candidatos' element={<CandidatesPage />} />
        <Route path='/jrvs' element={<JRVSPage />} />
        <Route path='/verificacion' element={<VerificationPage />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  </div>
);
