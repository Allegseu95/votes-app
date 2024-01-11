import React, { Fragment, useState, useEffect } from 'react';
import { Button, Label, TextInput, Tooltip } from 'flowbite-react';

import { useLoader } from '@/contexts/loader';

import { ballotService } from '@/services/ballot';

import { errorToast, successToast } from '@/utils/toast';
import { cleanText } from '@/utils/helpers';

import { initRegisterBallot } from '@/constants/forms';

export const BallotForm = ({ closeModal = () => {}, onFinish = async () => {}, ballot = null }) => {
  const { showLoader, hideLoader } = useLoader();

  const [formValues, setFormValues] = useState(initRegisterBallot);

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

    if (_data.dignity === '') {
      changeFormValues('dignity', 'invalid', true);
      isValid = false;
    }

    if (_data.election_date === '') {
      changeFormValues('election_date', 'invalid', true);
      isValid = false;
    }

    if (isValid) {
      handleService(_data);
    }
  };

  const handleService = async (data) => {
    showLoader();

    const response = ballot
      ? await ballotService.update(ballot.PapeletaId, data)
      : await ballotService.create(data);

    hideLoader();

    if (!response.error) {
      cleanFormValues();
      await onFinish();
      closeModal();
      successToast(`Papeleta ${ballot ? 'actualizada' : 'creada'} exitosamente!`);
    } else {
      errorToast(response.message);
    }
  };

  const configDataToEdit = () => {
    for (let key in initRegisterBallot) {
      changeFormValues(key, 'value', ballot[key]);
      changeFormValues(key, 'invalid', false);
    }
  };

  const cleanFormValues = () => {
    for (let key in initRegisterBallot) {
      changeFormValues(key, 'value', '');
      changeFormValues(key, 'invalid', false);
    }
  };

  const handleCancelButton = () => {
    closeModal();
    cleanFormValues();
  };

  useEffect(() => {
    if (ballot !== null) {
      configDataToEdit();
    } else {
      cleanFormValues();
    }
  }, [ballot]);

  return (
    <Fragment>
      <div className='mb-4'>
        <Label
          htmlFor='dignity'
          value='Dignidad:'
          color={formValues.dignity.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='dignity'
          placeholder='Presidente'
          required
          shadow
          type='text'
          value={formValues.dignity.value}
          onChange={(e) => {
            changeFormValues('dignity', 'value', e.target.value);
            changeFormValues('dignity', 'invalid', false);
          }}
          helperText={formValues.dignity.invalid && formValues.dignity.validateText}
          color={formValues.dignity.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='date'
          value='Fecha de Elección:'
          color={formValues.election_date.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='date'
          shadow
          required
          type='date'
          value={formValues.election_date.value}
          onChange={(e) => {
            changeFormValues('election_date', 'value', e.target.value);
            changeFormValues('election_date', 'invalid', false);
          }}
          helperText={formValues.election_date.invalid && formValues.election_date.validateText}
          color={formValues.election_date.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='w-100 flex justify-center items-center gap-4 mt-4'>
        <Tooltip content='Cancelar acción' className='dark:bg-white dark:text-black'>
          <Button pill color='failure' onClick={() => handleCancelButton()}>
            Cancelar
          </Button>
        </Tooltip>

        <Tooltip
          content={`${ballot ? 'Editar' : 'Crear'} papeleta`}
          className='dark:bg-white dark:text-black'>
          <Button pill onClick={() => validateForm()}>
            {ballot ? 'Editar' : 'Crear'}
          </Button>
        </Tooltip>
      </div>
    </Fragment>
  );
};
