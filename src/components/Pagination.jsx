import React, { useState } from 'react';
import { Button } from 'flowbite-react';

import {
  PiCaretDoubleLeftBold,
  PiCaretDoubleRightBold,
  PiCaretRightBold,
  PiCaretLeftBold,
} from 'react-icons/pi';

export const Pagination = ({ table }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const getStateTable = () => {
    const totalRows = table.getFilteredRowModel().rows.length;
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = table.getState().pagination.pageIndex;
    const rowsPerPage = table.getRowModel().rows.length;

    const firstIndex = pageIndex * pageSize + (totalRows === 0 ? 0 : 1);
    const lastIndex = pageIndex * pageSize + rowsPerPage;

    return {
      totalRows,
      firstIndex,
      lastIndex,
    };
  };

  const generatePageButtons = () => {
    const pageOptions = table.getPageOptions();

    const visiblePages = [];

    let startPage = Math.max(0, currentPageIndex - 2);
    let endPage = Math.min(pageOptions.length - 1, startPage + 4);

    if (currentPageIndex === pageOptions.length - 1 && startPage >= 2) {
      startPage = startPage - 2;
    }

    if (currentPageIndex === pageOptions.length - 2 && startPage >= 1) {
      startPage = startPage - 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(
        <Button
          key={i}
          size='xs'
          className={
            i === currentPageIndex ? 'bg-teal-400 dark:bg-teal-400' : 'bg-gray-600 dark:bg-gray-800'
          }
          onClick={() => {
            setCurrentPageIndex(i);
            table.setPageIndex(i);
          }}>
          <span className='w-4 h-4'>{pageOptions[i] + 1}</span>
        </Button>
      );
    }

    return visiblePages;
  };

  return (
    <div className='mt-4 md:flex items-center justify-between text-center md:flex-col lg:flex-row lg:items-center '>
      <div className='grid grid-cols-6 gap-1.5 xs:flex justify-between xs:gap-0.5 sm:grid sm:grid-cols-6 md:flex md:w-full lg:w-auto lg:gap-1'>
        <div className='flex flex-row justify-center gap-1 col-span-2 col-start-2'>
          <Button
            className='bg-gray-600 dark:bg-gray-800'
            size='xs'
            onClick={() => {
              setCurrentPageIndex(0);
              table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}>
            <PiCaretDoubleLeftBold className='w-4 h-4' />
          </Button>

          <Button
            size='xs'
            className='bg-gray-600 dark:bg-gray-800'
            onClick={() => {
              if (currentPageIndex > 0) {
                table.previousPage();
                setCurrentPageIndex(currentPageIndex - 1);
              }
            }}
            disabled={!table.getCanPreviousPage()}>
            <PiCaretLeftBold className='w-4 h-4' />
          </Button>
        </div>

        <div className='flex flex-row justify-evenly order-3 col-span-6 xs:order-2 xs:flex-1 xs:justify-center xs:gap-2 sm:order-3 md:order-2 md:flex-1'>
          {generatePageButtons()}
        </div>

        <div className='flex flex-row justify-center col-span-2 gap-1 order-2 xs:order-3 sm:order-2 md:order-3'>
          <Button
            size='xs'
            className='bg-gray-600 dark:bg-gray-800'
            onClick={() => {
              if (currentPageIndex < table.getPageCount() - 1) {
                setCurrentPageIndex(currentPageIndex + 1);
                table.nextPage();
              }
            }}
            disabled={!table.getCanNextPage()}>
            <PiCaretRightBold className='w-4 h-4' />
          </Button>

          <Button
            size='xs'
            className='bg-gray-600 dark:bg-gray-800'
            onClick={() => {
              setCurrentPageIndex(table.getPageCount() - 1);
              table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}>
            <PiCaretDoubleRightBold className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <div className='dark:text-white py-2 lg:py-0'>
        Mostrando del {getStateTable().firstIndex} al {getStateTable().lastIndex} del total de&nbsp;
        {getStateTable().totalRows} registros
      </div>
    </div>
  );
};
