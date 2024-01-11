import { Link } from 'react-router-dom';

export const SidebarLinkRed = ({ path = '/', label = '', icon: Icon, action = () => {} }) => {
  return (
    <Link
      onClick={() => action()}
      to={path}
      className='flex flex-row items-center justify-start gap-3 px-4 py-2 rounded-lg group hover:bg-red-600 dark:hover:bg-red-600'>
      <Icon className='text-gray-400 group-hover:text-black text-2xl dark:group-hover:text-white' />
      <p className='text-black dark:text-white'>{label}</p>
    </Link>
  );
};
