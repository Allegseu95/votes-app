import { useState } from 'react';
import { Button, Card, DarkThemeToggle, Label, TextInput } from 'flowbite-react';

import { useAuthContext } from '@/contexts/auth';
import { useLoader } from '@/contexts/loader';

import { adminService } from '@/services/admin';

import { errorToast, successToast } from '@/utils/toast';

export const LoginPage = () => {
  const { login } = useAuthContext();
  const { showLoader, hideLoader } = useLoader();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    showLoader();

    const body = {
      email,
      password,
    };

    const response = await adminService.login(body);

    if (!response?.error) {
      login(response.data);
      successToast('Bienvenido ' + response?.data?.name);
    } else {
      errorToast(response?.message);
    }

    hideLoader();
  };

  return (
    <section className='bg-gray-50 h-screen dark:bg-gray-800'>
      <form
        className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'
        onSubmit={handleSubmit}>
        <div className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>
          Panel de Administración
          <DarkThemeToggle className='ml-5' />
        </div>

        <Card className='w-full md:mt-0 sm:max-w-md xl:p-0 shadow-md'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center'>
            Iniciar sesión
          </h1>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='email' value='Email:' />
            </div>

            <TextInput
              id='email'
              placeholder='admin@gmail.com'
              shadow
              required
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='password' value='Contraseña:' />
            </div>

            <div className='relative'>
              <TextInput
                id='password'
                shadow
                required
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type='button'
                className='absolute right-2 top-2.5 text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:ring-gray-600'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='icon icon-tabler icon-tabler-eye'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                    <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0'></path>
                    <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6'></path>
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='icon icon-tabler icon-tabler-eye-closed'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                    <path d='M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4'></path>
                    <path d='M3 15l2.5 -3.8'></path>
                    <path d='M21 14.976l-2.492 -3.776'></path>
                    <path d='M9 17l.5 -4'></path>
                    <path d='M15 17l-.5 -4'></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <Button type='submit' className='w-full bg-primary-600 hover:bg-primary-700 mt-4 mb-3'>
              Ingresar
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
};
