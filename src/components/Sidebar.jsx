import React, { useState, Fragment } from 'react';
import { DarkThemeToggle, Sidebar } from 'flowbite-react';
import { Link } from 'react-router-dom';

import {
  MdLogout,
  MdHowToVote,
  MdPerson,
  MdOutlineBallot,
  MdOutlineContactMail,
} from 'react-icons/md';
import { FaChartArea } from 'react-icons/fa';
import { BsPersonBoundingBox } from 'react-icons/bs';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

import { useAuthContext } from '@/contexts/auth';

import { showOptionsAlert } from '@/utils/alerts';
import { successToast } from '@/utils/toast';

import { SidebarLink } from './SidebarLink';
import { SidebarLinkRed } from './SidebarLinkRed';

import Logo from '@/assets/icons/icon.png';

export const CustomSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { logout } = useAuthContext();

  const handleLogoutButton = async () => {
    const res = await showOptionsAlert('Está seguro de cerrar sesión?', undefined, '');

    if (res) {
      setTimeout(() => {
        logout();
      }, 1000);
      successToast('Cerraste sesión');
    }
  };

  return (
    <Fragment>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        type='button'
        className='inline-flex items-center absolute z-50 right-3 top-3 p-1 text-sm text-black rounded-lg sm:hidden hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-600 '>
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-7 h-7'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'></path>
        </svg>
      </button>

      <aside
        id='sidebar-responsive'
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen
            ? 'translate-x-0 animate__animated animate__fadeInLeft'
            : '-translate-x-full'
        } sm:translate-x-0 `}
        aria-label='Sidebar'>
        <Sidebar className='h-full overflow-y-auto dark:bg-gray-800'>
          <DarkThemeToggle className='absolute top-3 right-5' />

          <Link to={'/'} className='flex justify-center'>
            <img src={Logo} alt='logo' height={'120px'} width={'120px'} />
          </Link>

          <Sidebar.Items className='px-3 mt-5'>
            <Sidebar.ItemGroup>
              <SidebarLink path='/dashboard' label='Dashboard' icon={FaChartArea} />

              <SidebarLink path='/solicitudes' label='Solicitudes' icon={MdOutlineContactMail} />

              <SidebarLink
                path='/verificacion'
                label='Verificación'
                icon={IoMdCheckmarkCircleOutline}
              />
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <SidebarLink path='/observadores' label='Observadores' icon={MdPerson} />

              <SidebarLink path='/jrvs' label='JRVS' icon={MdHowToVote} />

              <SidebarLink path='/papeletas' label='Papeletas' icon={MdOutlineBallot} />

              <SidebarLink path='/candidatos' label='Candidatos' icon={BsPersonBoundingBox} />
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <SidebarLinkRed
                action={() => handleLogoutButton()}
                label='Cerrar sesión'
                icon={MdLogout}
              />
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className='bg-gray-900 dark:bg-gray-700 dark:bg-opacity-75 bg-opacity-70 inset-0 fixed top-0 left-0 w-full h-screen z-30 animate__animated animate__fadeIn'></div>
      )}
    </Fragment>
  );
};
