import React, { Fragment, useState, useEffect } from 'react';
import { Button, Label, TextInput, Tooltip, Select } from 'flowbite-react';
import { utils, read } from 'xlsx';

import { useLoader } from '@/contexts/loader';

import { candidateService } from '@/services/candidate';

import { UploadExcelFile } from '../UploadExcelFile';

import { errorToast, successToast } from '@/utils/toast';
import { cleanText } from '@/utils/helpers';

import { initRegisterCandidate } from '@/constants/forms';
import { EXCEL_FILE, GENDERS, GENDERS_IMAGES } from '@/constants';

const FEMALES = ['Femenino', 'F', 'femenino', 'f'];

export const CandidateForm = ({
  closeModal = () => {},
  onFinish = async () => {},
  ballots = [],
  candidate = null,
}) => {
  const { showLoader, hideLoader } = useLoader();

  const [formValues, setFormValues] = useState(initRegisterCandidate);

  const changeFormValues = (prop, key, value) => {
    let _formValues = { ...formValues };
    _formValues[prop][key] = value;
    setFormValues(_formValues);
  };

  const validateForm = () => {
    let isValid = true;

    const _data = {};

    for (let key in formValues) {
      _data[key] = cleanText(formValues[key].value);
    }

    if (_data.name === '') {
      changeFormValues('name', 'invalid', true);
      isValid = false;
    }

    if (_data.lastname === '') {
      changeFormValues('lastname', 'invalid', true);
      isValid = false;
    }

    if (_data.organization === '') {
      changeFormValues('organization', 'invalid', true);
      isValid = false;
    }

    if (_data.ballotId === '') {
      changeFormValues('ballotId', 'invalid', true);
      isValid = false;
    }

    if (isValid) {
      handleService(_data);
    }
  };

  const handleService = async (data) => {
    showLoader();

    data.photo = data?.gender === 'Femenino' ? GENDERS_IMAGES.female : GENDERS_IMAGES.male;

    const response = candidate
      ? await candidateService.update(candidate.CandidatoId, data)
      : await candidateService.create(data);

    hideLoader();

    if (!response.error) {
      cleanFormValues();
      await onFinish();
      closeModal();
      successToast(`Candidato ${candidate ? 'actualizado' : 'creado'} exitosamente!`);
    } else {
      errorToast(response.message);
    }
  };

  const configDataToEdit = () => {
    for (let key in initRegisterCandidate) {
      changeFormValues(key, 'value', candidate[key]);
      changeFormValues(key, 'invalid', false);
    }
  };

  const cleanFormValues = () => {
    for (let key in initRegisterCandidate) {
      changeFormValues(key, 'value', '');
      changeFormValues(key, 'invalid', false);
    }
  };

  const handleCancelButton = () => {
    closeModal();
    cleanFormValues();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type !== EXCEL_FILE) {
        errorToast('Archivo no permitido!');
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        showLoader();

        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = utils.sheet_to_json(worksheet, { raw: true });

        const insertData = [];

        excelData.forEach((item) => {
          const ballot = ballots.find(
            (ele) => ele.Dignidad.toLowerCase() === item?.Dignidad?.toLowerCase()
          );

          if (item.Nombres && item.Apellidos && item.Organizacion && ballot) {
            insertData.push({
              name: item?.Nombres,
              lastname: item?.Apellidos,
              gender: item?.Genero ?? '',
              birthdate: '',
              organization: item?.Organizacion,
              photo: FEMALES.includes(item.Genero) ? GENDERS_IMAGES.female : GENDERS_IMAGES.male,
              ballotId: ballot?.PapeletaId,
            });
          }
        });

        let succesCount = 0;

        for (let i = 0; i < insertData.length; i++) {
          const response = await candidateService.create(insertData[i]);

          if (!response.error) {
            succesCount++;
          }
        }

        await onFinish();

        closeModal();

        hideLoader();

        successToast(
          `${succesCount} Candidatos de ${excelData.length} fueron registrados exitosamente!`
        );

        errorToast(
          `${excelData.length - insertData.length} Candidatos de ${
            excelData.length
          } no pudieron ser registrados!`
        );
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    if (candidate !== null) {
      configDataToEdit();
    } else {
      cleanFormValues();
    }
  }, [candidate]);

  return (
    <Fragment>
      <UploadExcelFile text='Registrar Candidatos por Excel' upload={handleFileUpload} />

      <div className='mb-4'>
        <Label
          htmlFor='name'
          value='Nombres:'
          color={formValues.name.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='name'
          placeholder='Alex David'
          required
          shadow
          type='text'
          value={formValues.name.value}
          onChange={(e) => {
            changeFormValues('name', 'value', e.target.value);
            changeFormValues('name', 'invalid', false);
          }}
          helperText={formValues.name.invalid && formValues.name.validateText}
          color={formValues.name.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='lastname'
          value='Apellidos:'
          color={formValues.lastname.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='lastname'
          placeholder='Santacruz Morales'
          required
          shadow
          type='text'
          value={formValues.lastname.value}
          onChange={(e) => {
            changeFormValues('lastname', 'value', e.target.value);
            changeFormValues('lastname', 'invalid', false);
          }}
          helperText={formValues.lastname.invalid && formValues.lastname.validateText}
          color={formValues.lastname.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='organization'
          value='Organización Politica:'
          color={formValues.organization.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='organization'
          placeholder='Lista 65'
          required
          shadow
          type='text'
          value={formValues.organization.value}
          onChange={(e) => {
            changeFormValues('organization', 'value', e.target.value);
            changeFormValues('organization', 'invalid', false);
          }}
          helperText={formValues.organization.invalid && formValues.organization.validateText}
          color={formValues.organization.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='ballotId'
          value='Dignidad:'
          color={formValues.ballotId.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='ballotId'
          className='mb-4'
          required
          shadow
          value={formValues.ballotId.value}
          onChange={(e) => {
            changeFormValues('ballotId', 'value', e.target.value);
            changeFormValues('ballotId', 'invalid', false);
          }}
          helperText={formValues.ballotId.invalid && formValues.ballotId.validateText}
          color={formValues.ballotId.invalid ? 'failure' : 'gray'}>
          {ballots.map((item, index) => (
            <option key={index} value={item?.PapeletaId}>
              {item?.Dignidad}
            </option>
          ))}
        </Select>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='date'
          value='Fecha de Nacimiento:'
          color={formValues.birthdate.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='date'
          shadow
          required
          type='date'
          value={formValues.birthdate.value}
          onChange={(e) => {
            changeFormValues('birthdate', 'value', e.target.value);
            changeFormValues('birthdate', 'invalid', false);
          }}
          helperText={formValues.birthdate.invalid && formValues.birthdate.validateText}
          color={formValues.birthdate.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='gender'
          value='Género:'
          color={formValues.gender.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='gender'
          className='mb-4'
          required
          shadow
          value={formValues.gender.value}
          onChange={(e) => {
            changeFormValues('gender', 'value', e.target.value);
            changeFormValues('gender', 'invalid', false);
          }}
          helperText={formValues.gender.invalid && formValues.gender.validateText}
          color={formValues.gender.invalid ? 'failure' : 'gray'}>
          {GENDERS.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className='w-100 flex justify-center items-center gap-4 mt-4'>
        <Tooltip content='Cancelar acción' className='dark:bg-white dark:text-black'>
          <Button pill color='failure' onClick={() => handleCancelButton()}>
            Cancelar
          </Button>
        </Tooltip>

        <Tooltip
          content={`${candidate ? 'Editar' : 'Crear'} candidato`}
          className='dark:bg-white dark:text-black'>
          <Button pill onClick={() => validateForm()}>
            {candidate ? 'Editar' : 'Crear'}
          </Button>
        </Tooltip>
      </div>
    </Fragment>
  );
};
