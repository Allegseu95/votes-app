import React from 'react';
import { flexRender } from '@tanstack/react-table';

import { PiCaretUpDownFill, PiCaretUpFill, PiCaretDownFill } from 'react-icons/pi';

export const Table = ({ table }) => {
  return (
    <div className='overflow-auto border-2 dark:border-gray-400'>
      <table className='table-auto text-sm w-full min-w-[560px]:'>
        <thead>
          {table.getHeaderGroups().map((item) => (
            <tr
              key={item.id}
              className='text-gray-600 bg-gray-400 dark:bg-gray-700 dark:text-gray-300'>
              {item.headers.map((header) => (
                <th key={header.id} className='px-3 py-2 text-left'>
                  {header.isPlaceholder ? null : (
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none flex justify-between items-center'
                          : 'text-center'
                      }>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <PiCaretUpFill className='w-5 h-5' />,
                        desc: <PiCaretDownFill className='w-5 h-5' />,
                      }[header.column.getIsSorted()] ??
                        (header.column.getCanSort() ? (
                          <PiCaretUpDownFill className='w-5 h-5' />
                        ) : null)}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className='odd:bg-white even:bg-gray-200 text-gray-600 hover:bg-slate-300 dark:hover:bg-gray-600  dark:border-gray-700 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:text-white'>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='py-2 px-4'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
