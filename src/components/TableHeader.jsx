import React from 'react';
import { Button, Select, TextInput } from 'flowbite-react';

import { GoSearch } from 'react-icons/go';

export const TableHeader = ({
  dataLength = 0,
  filterValue,
  setFilterValue,
  buttonClick = () => {},
  onChangeSelect = () => {},
  showButton = true,
}) => {
  const optionsPagination = [
    { value: 5, label: '5 Registros' },
    { value: 10, label: '10 Registros' },
    { value: 20, label: '20 Registros' },
    { value: dataLength, label: 'Todo' },
  ];

  return (
    <div className='my-2 grid grid-cols-12 gap-3'>
      <Select
        className='col-span-5 xs:col-span-3 sm:col-span-5 md:col-span-3 lg:col-span-2 2xl:col-span-2'
        onChange={(e) => onChangeSelect(Number(e.target.value))}>
        {optionsPagination.map((item, index) => (
          <option key={index} value={item?.value}>
            {item?.label}
          </option>
        ))}
      </Select>

      {showButton && (
        <Button
          className='col-span-5 col-start-8 xs:col-span-3 xs:col-start-10 sm:col-span-5 sm:col-start-8 md:order-3 md:col-span-3 lg:col-span-2 2xl:col-span-1'
          pill
          onClick={() => buttonClick()}>
          Nuevo
        </Button>
      )}

      <TextInput
        className={`w-full col-span-12 xs:col-span-8 xs:col-start-5 sm:col-span-12 md:order-2 ${
          showButton ? 'md:col-span-5' : 'md:col-span-8'
        } md:col-start-5  ${showButton ? 'lg:col-start-6' : 'lg:col-start-8'}  2xl:col-start-7`}
        placeholder='Buscar...'
        type='text'
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        rightIcon={GoSearch}
      />
    </div>
  );
};
