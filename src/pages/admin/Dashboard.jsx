import React, { Fragment, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Tooltip as FlowbiteTooltip } from 'flowbite-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { utils, writeFile } from 'xlsx';

import { AiOutlineCloudDownload } from 'react-icons/ai';

import { useAuthContext } from '@/contexts/auth';
import { useLoader } from '@/contexts/loader';

import { recordService } from '@/services/record';

import { getDoughnutDatasets, getLineDatasets } from '@/utils/helpers';

import { DOUGHNUT_CHART_OPTIONS, LINE_CHART_OPTIONS, PROVINCES } from '@/constants';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardPage = () => {
  const { user } = useAuthContext();
  const { showLoader, hideLoader } = useLoader();

  const [totalsData, setTotalsData] = useState([]);
  const [provincesData, setProvincesData] = useState([]);

  const getApproveRecords = async () => {
    showLoader();

    const response = await recordService.getApproves();

    if (!response.error) {
      // config totals data - Doughnut
      const result = {};

      for (const record of response?.data) {
        if (!result[record.PapeletaId[0]]) {
          result[record.PapeletaId[0]] = {
            dignity: record?.Dignidad,
            candidates: {},
          };
        }

        if (!result[record.PapeletaId[0]].candidates[record.CandidatoId[0]]) {
          result[record.PapeletaId[0]].candidates[record.CandidatoId[0]] = {
            name: record?.Nombre + ' ' + record?.Apellido,
            votes: 0,
          };
        }

        result[record.PapeletaId[0]].candidates[record.CandidatoId[0]].votes +=
          record?.CantidadVotos;
      }

      const data = Object.values(result).map((item) => ({
        ...item,
        candidates: Object.values(item.candidates).map((ele) => ele.name),
        votes: Object.values(item.candidates).map((ele) => ele.votes),
      }));

      setTotalsData(data);

      // config totals data by provinces - Line
      const total = {};

      for (const record of response?.data) {
        if (record.Dignidad === 'Presidente') {
          if (!total[record.PapeletaId[0]]) {
            total[record.PapeletaId[0]] = {
              dignity: record?.Dignidad,
              candidates: {},
            };
          }

          if (!total[record.PapeletaId[0]].candidates[record.CandidatoId[0]]) {
            total[record.PapeletaId[0]].candidates[record.CandidatoId[0]] = {
              name: record?.Nombre + ' ' + record?.Apellido,
              votes: PROVINCES.map((ele) => ({ province: ele, votes: 0 })),
            };
          }

          total[record.PapeletaId[0]].candidates[record.CandidatoId[0]].votes = total[
            record.PapeletaId[0]
          ].candidates[record.CandidatoId[0]].votes.map((ele) => {
            if (record?.Provincia === ele.province) {
              ele.votes += record?.CantidadVotos;
            }

            return ele;
          });
        }
      }

      const _provincesData = Object.values(total).map((item) => ({
        ...item,
        candidates: Object.values(item.candidates).map((ele) => ({
          ...ele,
          votes: ele.votes.map((vot) => vot.votes),
        })),
      }));

      setProvincesData(_provincesData);
    }

    hideLoader();
  };

  const downloadExcel = () => {
    const workBook = utils.book_new();

    for (const item of totalsData) {
      const data = item?.candidates?.map((ele, index) => ({
        Candidato: ele,
        Votos: item?.votes[index],
      }));

      data.sort((a, b) => b?.Votos - a?.Votos);

      data.push({
        Candidato: 'Votos Totales',
        Votos: data.reduce((acc, ele) => acc + ele?.Votos, 0),
      });

      const workSheet = utils.json_to_sheet(data);

      utils.book_append_sheet(workBook, workSheet, item?.dignity);
    }

    writeFile(workBook, 'Reporte.xlsx');
  };

  const downloadExcelByProvince = () => {
    const workBook = utils.book_new();

    for (const item of provincesData) {
      const data = item?.candidates?.map((ele) => {
        let result = {
          Candidato: ele?.name,
          'Votos Totales': ele?.votes?.reduce((acc, val) => acc + val, 0),
        };

        PROVINCES.forEach((pro, index) => {
          result[pro] = ele.votes[index];
        });

        return result;
      });

      data.sort((a, b) => b?.Total - a?.Total);

      const workSheet = utils.json_to_sheet(data);

      utils.book_append_sheet(workBook, workSheet, item?.dignity);
    }

    writeFile(workBook, 'Reporte por Provincia.xlsx');
  };

  useEffect(() => {
    getApproveRecords();
  }, []);

  return (
    <div className='h-full px-6 py-0 xs:py-5 flex flex-col items-center gap-5 animate__animated animate__pulse'>
      <h1 className='text-4xl text-center font-bold dark:text-white'>¡Bienvenido, {user?.name}!</h1>

      <div className='flex flex-row gap-5 items-center'>
        <h3 className='text-center font-bold uppercase dark:text-white text-2xl'>Votos Totales</h3>

        <FlowbiteTooltip
          placement={'right'}
          content={'Descargar Reporte'}
          className='dark:bg-white dark:text-black'>
          <AiOutlineCloudDownload
            className='dark:text-white text-5xl cursor-pointer'
            onClick={downloadExcel}
          />
        </FlowbiteTooltip>
      </div>

      <div className='grid grid-cols-2 gap-5 w-full'>
        {totalsData.map((item, index) => (
          <div
            key={index}
            className={`w-full relative flex justify-center items-center h-96 ${
              index === totalsData.length - 1 && totalsData.length % 2 !== 0 ? 'col-span-2' : ''
            }`}>
            <p className='absolute top-0 left-0 right-0 text-center uppercase font-bold italic dark:text-white'>
              {item.dignity}
            </p>

            <Doughnut
              data={{
                labels: item.candidates,
                datasets: getDoughnutDatasets(item.votes),
              }}
              options={DOUGHNUT_CHART_OPTIONS}
            />
          </div>
        ))}
      </div>

      <div className='flex flex-row gap-5 items-center'>
        <h3 className='text-center font-bold uppercase dark:text-white text-2xl'>
          Votos por Provincia
        </h3>

        <FlowbiteTooltip
          placement={'right'}
          content={'Descargar Reporte'}
          className='dark:bg-white dark:text-black'>
          <AiOutlineCloudDownload
            className='dark:text-white text-5xl cursor-pointer'
            onClick={downloadExcelByProvince}
          />
        </FlowbiteTooltip>
      </div>

      {provincesData.map((item, index) => (
        <Fragment key={index}>
          <p className='text-center uppercase font-bold italic dark:text-white'>{item.dignity}</p>

          <Line
            key={index}
            options={LINE_CHART_OPTIONS}
            data={{
              labels: PROVINCES,
              datasets: getLineDatasets(item.candidates),
            }}
          />
        </Fragment>
      ))}
    </div>
  );
};
