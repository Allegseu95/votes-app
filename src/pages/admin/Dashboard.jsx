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
import { Line, Doughnut } from 'react-chartjs-2';

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

  useEffect(() => {
    getApproveRecords();
  }, []);

  return (
    <div className='h-full px-6 py-0 xs:py-5 flex flex-col items-center gap-5 animate__animated animate__pulse'>
      <h1 className='text-4xl text-center font-bold dark:text-white'>¡Bienvenido, {user?.name}!</h1>

      <h3 className='text-center font-bold uppercase dark:text-white text-2xl'>Votos Totales</h3>

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
