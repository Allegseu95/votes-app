import React, { useState, useEffect } from 'react';
import { Card, Button, Tooltip } from 'flowbite-react';

import { GoCheck } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';

import { useLoader } from '@/contexts/loader';

import { recordService } from '@/services/record';
import { RecordDetail } from '@/components/admin/RecordDetail';
import { errorToast, successToast } from '@/utils/toast';

export const VerificationPage = () => {
  const { showLoader, hideLoader } = useLoader();

  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState(null);

  const getPendingRecords = async () => {
    showLoader();

    const response = await recordService.getPendings();

    if (!response.error) {
      const result = {};

      for (const record of response?.data) {
        if (!result[record.ActaId[0]]) {
          result[record.ActaId[0]] = { ActaId: record.ActaId[0], details: [], data: record };
        }

        result[record.ActaId[0]]?.details?.push(record);
      }

      let data = Object.values(result);

      data = data?.map((item) => ({
        name: item?.data?.Numero + ' ' + item?.data?.Genero[1] + ' - ' + item?.data?.Dignidad,
        ...item,
      }));

      setRecords(data);
    }

    hideLoader();
  };

  const getInvalidRecord = (record) => {
    if (!record?.data?.FirmaPresidente) return true;

    if (!record?.data?.FirmaSecretario) return true;

    const totalCandidates = record?.details.reduce((acc, val) => acc + val?.CantidadVotos, 0);

    const total = totalCandidates + record?.data?.VotosNulos + record?.data?.VotosBlancos;

    if (total > record?.data?.CantidadVotaciones) return true;

    if (total > record?.data?.CantidadVotantes) return true;

    return false;
  };

  const updateRecord = async (id, state) => {
    showLoader();

    const response = await recordService.update(id, state);

    hideLoader();

    if (!response.error) {
      setRecord(null);
      await getPendingRecords();
      successToast('Acta verificada correctamente!');
    } else {
      errorToast(response?.message);
    }
  };

  useEffect(() => {
    getPendingRecords();
  }, []);

  return (
    <div className='h-screen flex flex-col px-5 py-0 sm:py-5 animate__animated animate__pulse'>
      <div className='text-center'>
        <h1 className='dark:text-white dark:font-bold text-3xl'>Verificación de Actas</h1>
        <p className='dark:text-white italic mb-3'>
          Aprueba o Rechaza las Actas Registradas por los Observadores
        </p>
      </div>

      <section className='flex-1 flex flex-row gap-8'>
        <Card className='w-[300px]'>
          <h5 className='text-xl font-bold leading-none text-gray-900 dark:text-white pl-3'>
            Actas
          </h5>

          <div className='flow-root overflow-y-auto h-[500px] px-3'>
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
              {records.map((item, index) => (
                <li key={index} className='py-2'>
                  <div
                    onClick={() => setRecord(item)}
                    className={`flex flex-col min-w-0 flex-1 items-start hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg py-1 px-4 cursor-pointer ${
                      record?.ActaId === item?.ActaId ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}>
                    <p className='truncate max-w-[200px] font-medium text-lg text-gray-900 dark:text-white'>
                      {item?.data?.Recinto}
                    </p>

                    <p className='truncate max-w-[200px] text-sm font-medium text-gray-900 dark:text-white'>
                      {item?.name}
                    </p>

                    <p className='truncate max-w-[200px] text-sm text-gray-500 dark:text-gray-400'>
                      Cantidad de Votantes: <strong>{item?.data?.CantidadVotantes}</strong>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className='flex relative shadow-lg dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg animate__animated animate__fadeIn h-[600px] flex-1'>
          {record && (
            <div className='flex flex-col gap-5 p-5'>
              <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row gap-5 justify-center items-center flex-1'>
                  <p className='dark:text-white text-center'>{record?.name}</p>

                  {getInvalidRecord(record) && (
                    <strong className='text-red-600 dark:text-red-500 uppercase'>
                      Acta Inválida
                    </strong>
                  )}
                </div>

                <div className='flex flex-row gap-3 items-center justify-between'>
                  <Tooltip content={'Aprobar'} className='dark:bg-white dark:text-black'>
                    <Button
                      outline
                      pill
                      color='success'
                      size={'sm'}
                      onClick={() => updateRecord(record?.ActaId, 'approve')}>
                      <GoCheck />
                    </Button>
                  </Tooltip>

                  <Tooltip content={'Rechazar'} className='dark:bg-white dark:text-black'>
                    <Button
                      outline
                      pill
                      color='failure'
                      size={'sm'}
                      onClick={() => updateRecord(record?.ActaId, 'reject')}>
                      <MdOutlineCancel />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div className='grid grid-cols-4 gap-5'>
                <RecordDetail
                  label='Firma de Presidente:'
                  value={record?.data?.FirmaPresidente ? '✅' : '❌'}
                />

                <RecordDetail
                  label='Firma de Secretaio:'
                  value={record?.data?.FirmaSecretario ? '✅' : '❌'}
                />
                <RecordDetail label='Votos Blancos:' value={record?.data?.VotosBlancos} />

                <RecordDetail label='Votos Nulos:' value={record?.data?.VotosNulos} />

                <RecordDetail label='Cantidad de Votos:' value={record?.data?.CantidadVotaciones} />

                {record?.details?.map((item, index) => (
                  <RecordDetail
                    key={index}
                    label={item?.Nombre + ' ' + item?.Apellido + ': '}
                    value={item?.CantidadVotos}
                  />
                ))}
              </div>

              <img
                src={record?.data?.Imagen[0]}
                alt={record?.data?.Codigo[0]}
                className='h-96 w-96 self-center'
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
