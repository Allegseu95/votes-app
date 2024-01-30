import React from 'react';
import { Label, FileInput } from 'flowbite-react';

export const UploadExcelFile = ({ upload = () => {}, text = 'Subir Archivo Excel' }) => {
  return (
    <div className='flex flex-row justify-center items-center gap-1'>
      <Label
        htmlFor='file'
        value={text}
        className='cursor-pointer text-center bg-gray-50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm dark:shadow-sm-light p-2.5'
      />
      <FileInput id='file' accept='.xls, .xlsx' className='hidden' onChange={upload} />
    </div>
  );
};
