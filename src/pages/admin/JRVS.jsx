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

import { ballotService } from '@/services/ballot';
import { jrvService } from '@/services/jrv';
import { jrvBallotService } from '@/services/jrvBallot';
import { userService } from '@/services/user';

import { TableHeader } from '@/components/TableHeader';
import { Table } from '@/components/Table';
import { ButtonActionTable } from '@/components/ButtonActionTable';
import { Pagination } from '@/components/Pagination';
import { JRVForm } from '@/components/admin/JRVForm';

import { showOptionsAlert } from '@/utils/alerts';
import { errorToast, successToast } from '@/utils/toast';
import { filterData } from '@/utils/helpers';

export const JRVSPage = () => {
  const { showLoader, hideLoader } = useLoader();

  const [showModal, setShowModal] = useState(false);
  const [jrvs, setJrvs] = useState([]);
  const [jrv, setJrv] = useState(null);
  const [ballots, setBallots] = useState([]);
  const [observers, setObservers] = useState([]);

  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'Numero',
      header: () => <p>Número</p>,
      cell: (info) => <p className='font-bold'>{info.getValue()}</p>,
    },
    {
      accessorKey: 'gender',
      header: () => <p>Género</p>,
    },
    {
      accessorKey: 'DireccionRecinto',
      header: () => <p>Dirección</p>,
    },
    {
      accessorKey: 'Recinto',
      header: () => <p>Recinto</p>,
    },
    {
      accessorKey: 'ZonaElectoral',
      header: () => <p>Zona Electoral</p>,
    },
    {
      accessorKey: 'Parroquia',
      header: () => <p>Parroquia</p>,
    },
    {
      accessorKey: 'TipoParroquia',
      header: () => <p>Tipo de Parroquia</p>,
    },
    {
      accessorKey: 'Canton',
      header: () => <p>Cantón</p>,
    },
    {
      accessorKey: 'Circunscripcion',
      header: () => <p>Circunscripción</p>,
    },
    {
      accessorKey: 'Provincia',
      header: () => <p>Provincia</p>,
    },
    {
      accessorKey: 'CantidadVotantes',
      header: () => <p>Cantidad de Votantes</p>,
    },
    {
      accessorKey: 'observer',
      header: () => <p>Observador</p>,
    },
    {
      accessorKey: 'ballots',
      header: () => <p>Dignidades</p>,
    },
    {
      header: 'Acciones',
      cell: (info) => (
        <ButtonActionTable
          deleteAction={() => deleteJrv(jrvs[info.row.index]?.JRVId)}
          editAction={() => updateJrv(jrvs[info.row.index])}
        />
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: jrvs,
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

  const getJrvs = async () => {
    showLoader();

    const jrvBallots = await jrvBallotService.getAll();

    const response = await jrvService.getAll();

    const formatter = new Intl.ListFormat('es');

    if (!response.error) {
      const _data = response?.data?.map((item) => ({
        ...item,
        observer: item?.Nombre + ' ' + item?.Apellido,
        ballots: formatter.format(
          jrvBallots?.data
            ?.filter((jrvBallot) => jrvBallot.JRVId === item.JRVId)
            ?.map((ele) => ele?.Dignidad)
        ),

        number: item?.Numero,
        gender: item?.Genero[0],
        address: item?.DireccionRecinto,
        place: item?.Recinto,
        zone: item?.ZonElectoral,
        parish: item?.Parroquia,
        typeParish: item?.TipoParroquia,
        canton: item?.Canton,
        district: item?.Circunscripcion,
        province: item?.Provincia,
        number_of_voters: item?.CantidadVotantes,
        userId: item?.UsuarioId[0],
        ballotsId: jrvBallots?.data
          ?.filter((jrvBallot) => jrvBallot.JRVId === item.JRVId)
          ?.map((ele) => ele?.PapeletaId[0]),
      }));

      setJrvs(_data);
    }

    hideLoader();
  };

  const getBallots = async () => {
    showLoader();

    const response = await ballotService.getAll();

    if (!response.error) {
      let _data = response?.data?.map((item) => ({ ...item, checked: false }));

      _data.sort((a, b) => a.Dignidad.localeCompare(b.Dignidad));

      setBallots(_data);
    }

    hideLoader();
  };

  const getObservers = async () => {
    showLoader();

    const response = await userService.getAll();

    if (!response.error) {
      let _data = response?.data?.map((item) => ({
        ...item,
        name: item?.Nombre + ' ' + item?.Apellido,
      }));

      _data.sort((a, b) => a.name.localeCompare(b.name));

      _data = [{ UsuarioId: '', name: 'Seleccione un observador' }, ..._data];

      setObservers(_data);
    }

    hideLoader();
  };

  const deleteJrv = async (id) => {
    const res = await showOptionsAlert();

    if (res) {
      showLoader();

      const response = await jrvService.delete(id);

      hideLoader();

      if (!response.error) {
        await getJrvs();
        successToast('JRV eliminada exitosamente!');
      } else {
        errorToast(response.message);
      }
    }
  };

  const updateJrv = (data) => {
    setJrv(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setJrv(null);
    setShowModal(false);
  };

  useEffect(() => {
    getJrvs();
    getBallots();
    getObservers();
  }, []);

  return (
    <div className='h-full px-5 py-0 sm:py-5 animate__animated animate__pulse'>
      <h1 className='dark:text-white dark:font-bold text-3xl text-center mb-6'>
        Juntas Receptoras de Voto
      </h1>

      <TableHeader
        dataLength={jrvs.length}
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
        <Modal.Header>{jrv ? 'Editar JRV' : 'Nueva JRV'}</Modal.Header>

        <Modal.Body>
          <JRVForm
            closeModal={closeModal}
            onFinish={getJrvs}
            ballots={ballots}
            observers={observers}
            jrv={jrv}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
