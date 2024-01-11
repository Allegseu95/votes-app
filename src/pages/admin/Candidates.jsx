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

import { candidateService } from '@/services/candidate';
import { ballotService } from '@/services/ballot';

import { TableHeader } from '@/components/TableHeader';
import { Table } from '@/components/Table';
import { ButtonActionTable } from '@/components/ButtonActionTable';
import { Pagination } from '@/components/Pagination';
import { CandidateForm } from '@/components/admin/CandidateForm';

import { showOptionsAlert } from '@/utils/alerts';
import { errorToast, successToast } from '@/utils/toast';
import { filterData } from '@/utils/helpers';

import { BIRTHDATE_DEFAULT } from '@/constants';

export const CandidatesPage = () => {
  const { showLoader, hideLoader } = useLoader();

  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [ballots, setBallots] = useState([]);

  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'OrganizacionPolitica',
      header: () => <p>Organización Politica</p>,
      cell: (info) => <p className='font-bold'>{info.getValue()}</p>,
    },
    {
      accessorKey: 'Dignidad',
      header: () => <p>Dignidad</p>,
    },
    {
      accessorKey: 'Nombre',
      header: () => <p>Nombre</p>,
    },
    {
      accessorKey: 'Apellido',
      header: () => <p>Apellido</p>,
    },
    {
      accessorKey: 'Genero',
      header: () => <p>Género</p>,
    },
    {
      accessorKey: 'date',
      header: () => <p>Fecha de Nacimiento</p>,
    },
    {
      accessorKey: 'Imagen',
      header: () => <p>Imagen</p>,
      cell: (info) => <img src={info.getValue()} className='rounded-full w-14 h-14' />,
    },
    {
      header: 'Acciones',
      cell: (info) => (
        <ButtonActionTable
          deleteAction={() => deleteCandidate(candidates[info.row.index]?.CandidatoId)}
          editAction={() => updateCandidate(candidates[info.row.index])}
        />
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: candidates,
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

  const getCandidates = async () => {
    showLoader();
    const response = await candidateService.getAll();

    if (!response.error) {
      const _data = response?.data?.map((item) => ({
        ...item,
        date:
          item?.FechaNacimiento === BIRTHDATE_DEFAULT
            ? ''
            : moment.utc(item?.FechaNacimiento).format('DD/MMM/YYYY'),
        name: item?.Nombre,
        lastname: item?.Apellido,
        gender: item?.Genero,
        birthdate: moment.utc(item?.FechaNacimiento).format('YYYY-MM-DD'),
        organization: item?.OrganizacionPolitica,
        ballotId: item?.PapeletaId[0],
      }));

      setCandidates(_data);
    }

    hideLoader();
  };

  const getBallots = async () => {
    showLoader();
    const response = await ballotService.getAll();

    if (!response.error) {
      let _data = [...(response?.data ?? [])];

      _data.sort((a, b) => a.Dignidad.localeCompare(b.Dignidad));

      _data = [{ PapeletaId: '', Dignidad: 'Seleccione una dignidad' }, ..._data];

      setBallots(_data);
    }

    hideLoader();
  };

  const deleteCandidate = async (id) => {
    const res = await showOptionsAlert();

    if (res) {
      showLoader();

      const response = await candidateService.delete(id);

      hideLoader();

      if (!response.error) {
        await getCandidates();
        successToast('Candidato eliminado exitosamente!');
      } else {
        errorToast(response.message);
      }
    }
  };

  const updateCandidate = (data) => {
    setCandidate(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setCandidate(null);
    setShowModal(false);
  };

  useEffect(() => {
    getCandidates();
    getBallots();
  }, []);

  return (
    <div className='h-full px-5 py-0 sm:py-5 animate__animated animate__pulse'>
      <h1 className='dark:text-white dark:font-bold text-3xl text-center mb-6'>Candidatos</h1>

      <TableHeader
        dataLength={candidates.length}
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
        <Modal.Header>{candidate ? 'Editar Candidato' : 'Nuevo Candidato'}</Modal.Header>

        <Modal.Body>
          <CandidateForm
            closeModal={closeModal}
            onFinish={getCandidates}
            ballots={ballots}
            candidate={candidate}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
