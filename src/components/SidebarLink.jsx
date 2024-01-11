import { Link } from 'react-router-dom';

export const SidebarLink = ({ path = '/', label = '', icon: Icon }) => {
  return (
    <Link
      to={path}
      className='flex flex-row items-center justify-start gap-3 px-4 py-2 rounded-lg group hover:bg-gray-200 dark:hover:bg-gray-600'>
      <Icon className='text-gray-400 group-hover:text-black text-2xl dark:group-hover:text-white' />
      <p className='text-black dark:text-white'>{label}</p>
    </Link>
  );
};
