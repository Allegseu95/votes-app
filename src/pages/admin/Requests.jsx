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

import { requestService } from '@/services/request';

import { TableHeader } from '@/components/TableHeader';
import { Table } from '@/components/Table';
import { ButtonActionTable } from '@/components/ButtonActionTable';
import { Pagination } from '@/components/Pagination';
import { RequestForm } from '@/components/admin/RequestForm';

import { showOptionsAlert } from '@/utils/alerts';
import { errorToast, successToast } from '@/utils/toast';
import { filterData } from '@/utils/helpers';

export const RequestsPage = () => {
  const { showLoader, hideLoader } = useLoader();

  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState(null);

  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'Email',
      header: () => <p>Email</p>,
      cell: (info) => <p className='font-bold'>{info.getValue()}</p>,
    },
    { accessorKey: 'confirmado', header: () => <p>Cuenta Confirmada</p> },
    { accessorKey: 'approve', header: () => <p>Estado</p> },
    {
      header: 'Acciones',
      cell: (info) => (
        <ButtonActionTable
          deleteTooltipMessage='Eliminar Solicitud'
          deleteAction={() => deleteRequest(requests[info.row.index]?.Id)}
          approveRequest={
            requests[info.row.index]?.aprobado === true
              ? null
              : () => openModal(requests[info.row.index])
          }
        />
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: requests,
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

  const getRequests = async () => {
    showLoader();

    const response = await requestService.getAll();

    if (!response.error) {
      const _data = response?.data?.map((item) => ({
        ...item,
        confirmado: item?.EmailConfirmed ? 'SI' : 'NO',
        approve: item?.aprobado ? 'Cuenta Aprobada ✅' : 'Cuenta Pendiente ⚠️',
      }));

      setRequests(_data);
    }

    hideLoader();
  };

  const deleteRequest = async (id) => {
    const res = await showOptionsAlert();

    if (res) {
      showLoader();

      const response = await requestService.delete(id);

      hideLoader();

      if (!response.error) {
        await getRequests();
        successToast('Solicitud eliminada exitosamente!');
      } else {
        errorToast(
          'No se puede eliminar la solicitud porque ya tiene un observador con jrvs asociado'
        );
      }
    }
  };

  const openModal = async (register) => {
    setRequest(register);
    setShowModal(true);
  };

  const closeModal = () => {
    setRequest(null);
    setShowModal(false);
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className='h-full px-5 py-0 sm:py-5 animate__animated animate__pulse'>
      <h1 className='dark:text-white dark:font-bold text-3xl text-center mb-6'>Solicitudes</h1>

      <TableHeader
        dataLength={requests.length}
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
        <Modal.Header>Aprobar Solicitud</Modal.Header>
        <Modal.Body>
          <RequestForm closeModal={closeModal} onFinish={getRequests} request={request} />
        </Modal.Body>
      </Modal>
    </div>
  );
};
