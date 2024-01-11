import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import moment from 'moment';

import { useLoader } from '@/contexts/loader';

import { ballotService } from '@/services/ballot';

import { TableHeader } from '@/components/TableHeader';
import { Table } from '@/components/Table';
import { ButtonActionTable } from '@/components/ButtonActionTable';
import { Pagination } from '@/components/Pagination';
import { BallotForm } from '@/components/admin/BallotForm';

import { showOptionsAlert } from '@/utils/alerts';
import { errorToast, successToast } from '@/utils/toast';

import { filterData } from '@/utils/helpers';

export const BallotsPage = () => {
  const { showLoader, hideLoader } = useLoader();

  const [showModal, setShowModal] = useState(false);
  const [ballots, setBallots] = useState([]);
  const [ballot, setBallot] = useState(null);

  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'Dignidad',
      header: () => <p>Dignidad</p>,
      cell: (info) => <p className='font-bold'>{info.getValue()}</p>,
    },
    {
      accessorKey: 'date',
      header: () => <p>Fecha de Elección</p>,
    },
    {
      header: 'Acciones',
      cell: (info) => (
        <ButtonActionTable
          deleteAction={() => deleteBallot(ballots[info.row.index]?.PapeletaId)}
          editAction={() => updateBallot(ballots[info.row.index])}
        />
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: ballots,
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

  const getBallots = async () => {
    showLoader();
    const response = await ballotService.getAll();

    if (!response.error) {
      const _data = response?.data?.map((item) => ({
        ...item,
        date: moment.utc(item?.FechaEleccion).format('dddd, DD MMMM YYYY'),
        dignity: item.Dignidad,
        election_date: moment.utc(item?.FechaEleccion).format('YYYY-MM-DD'),
      }));

      setBallots(_data);
    }

    hideLoader();
  };

  const deleteBallot = async (id) => {
    const res = await showOptionsAlert();

    if (res) {
      showLoader();

      const response = await ballotService.delete(id);

      hideLoader();

      if (!response.error) {
        await getBallots();
        successToast('Papeleta eliminada exitosamente!');
      } else {
        errorToast(response.message);
      }
    }
  };

  const updateBallot = (data) => {
    setBallot(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setBallot(null);
    setShowModal(false);
  };

  useEffect(() => {
    getBallots();
  }, []);

  return (
    <div className='h-full px-5 py-0 sm:py-5 animate__animated animate__pulse'>
      <h1 className='dark:text-white dark:font-bold text-3xl text-center mb-6'>Papeletas</h1>

      <TableHeader
        dataLength={ballots.length}
        filterValue={filter}
        setFilterValue={setFilter}
        buttonClick={() => setShowModal(true)}
        onChangeSelect={(number) => table.setPageSize(number)}
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
        <Modal.Header>{ballot ? 'Editar Papeleta' : 'Nueva Papeleta'}</Modal.Header>

        <Modal.Body>
          <BallotForm closeModal={closeModal} onFinish={getBallots} ballot={ballot} />
        </Modal.Body>
      </Modal>
    </div>
  );
};
