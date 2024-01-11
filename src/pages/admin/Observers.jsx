import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import { useLoader } from '@/contexts/loader';

import { userService } from '@/services/user';

import { TableHeader } from '@/components/TableHeader';
import { Table } from '@/components/Table';
import { ButtonActionTable } from '@/components/ButtonActionTable';
import { Pagination } from '@/components/Pagination';
import { ObserverForm } from '@/components/admin/ObserverForm';

import { filterData } from '@/utils/helpers';

export const ObserversPage = () => {
  const { showLoader, hideLoader } = useLoader();

  const [showModal, setShowModal] = useState(false);
  const [observers, setObservers] = useState([]);
  const [observer, setObserver] = useState(null);

  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'ci',
      header: () => <p>Cédula</p>,
      cell: (info) => <p className='font-bold'>{info.getValue()}</p>,
    },
    { accessorKey: 'name', header: () => <p>Nombre</p> },
    { accessorKey: 'lastname', header: () => <p>Apellido</p> },
    { accessorKey: 'Email', header: () => <p>Email</p> },
    { accessorKey: 'gender', header: () => <p>Género</p> },
    {
      header: 'Acciones',
      cell: (info) => (
        <ButtonActionTable editAction={() => updateObserver(observers[info.row.index])} />
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: observers,
    columns,
    state: {
      globalFilter: filter,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filterData,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  const getObservers = async () => {
    showLoader();

    const response = await userService.getAll();

    if (!response.error) {
      const _data = response?.data?.map((item) => ({
        name: item.Nombre,
        lastname: item.Apellido,
        ci: item.Cedula,
        gender: item.Genero,
        ...item,
      }));

      setObservers(_data);
    }

    hideLoader();
  };

  const updateObserver = async (data) => {
    setObserver(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setObserver(null);
    setShowModal(false);
  };

  useEffect(() => {
    getObservers();
  }, []);

  return (
    <div className='h-full px-5 py-0 sm:py-5 animate__animated animate__pulse'>
      <h1 className='dark:text-white dark:font-bold text-3xl text-center mb-6'>Observadores</h1>

      <TableHeader
        dataLength={observers.length}
        filterValue={filter}
        setFilterValue={setFilter}
        onChangeSelect={(number) => table.setPageSize(number)}
        showButton={false}
      />

      <Table table={table} />

      <Pagination table={table} />

      <Modal
        className='h-full animate__animated animate__fadeIn'
        dismissible
        size={'md'}
        position='center-right'
        show={showModal}
        onClose={closeModal}>
        <Modal.Header>Editar Observador</Modal.Header>
        <Modal.Body>
          <ObserverForm closeModal={closeModal} onFinish={getObservers} observer={observer} />
        </Modal.Body>
      </Modal>
    </div>
  );
};
