import React from 'react';

export const RecordDetail = ({ label = '', value = '' }) => {
  return (
    <div className='flex flex-row gap-2 items-center justify-start'>
      <p className='dark:text-white'>{label}</p>
      <strong className='dark:text-white'>{value}</strong>
    </div>
  );
};
