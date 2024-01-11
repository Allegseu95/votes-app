import React, { Fragment, useState, useEffect } from 'react';
import { Button, Label, TextInput, Select, Tooltip } from 'flowbite-react';

import { useLoader } from '@/contexts/loader';

import { userService } from '@/services/user';

import { errorToast, successToast } from '@/utils/toast';
import { cleanText } from '@/utils/helpers';

import { GENDERS } from '@/constants';
import { regexCI } from '@/constants/regex';
import { initRegisterUser } from '@/constants/forms';

export const ObserverForm = ({
  closeModal = () => {},
  onFinish = async () => {},
  observer = null,
}) => {
  const { showLoader, hideLoader } = useLoader();

  const [formValues, setFormValues] = useState(initRegisterUser);

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

    if (!regexCI.test(_data.ci)) {
      changeFormValues('ci', 'invalid', true);
      isValid = false;
    }

    if (isValid) {
      updateObserver(_data);
    }
  };

  const updateObserver = async (data) => {
    showLoader();

    const response = await userService.update(data, observer?.UsuarioId);

    hideLoader();

    if (!response.error) {
      cleanFormValues();
      await onFinish();
      closeModal();
      successToast(`Observador actualizado exitosamente!`);
    } else {
      errorToast(response.message);
    }
  };

  const configDataToEdit = () => {
    for (let key in initRegisterUser) {
      changeFormValues(key, 'value', observer[key]);
      changeFormValues(key, 'invalid', false);
    }
  };

  const cleanFormValues = () => {
    for (let key in initRegisterUser) {
      changeFormValues(key, 'value', '');
      changeFormValues(key, 'invalid', false);
    }
  };

  const cancelAction = () => {
    closeModal();
    cleanFormValues();
  };

  useEffect(() => {
    configDataToEdit();
  }, [observer]);

  return (
    <Fragment>
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
          htmlFor='ci'
          value='Cédula:'
          color={formValues.ci.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='ci'
          placeholder='1004332765'
          required
          shadow
          type='text'
          value={formValues.ci.value}
          onChange={(e) => {
            changeFormValues('ci', 'invalid', false);

            if (
              (!/^[0-9]+$/.test(e.target.value) || e.target.value.length > 10) &&
              e.target.value !== ''
            ) {
              changeFormValues('ci', 'invalid', true);
              return;
            }

            changeFormValues('ci', 'value', e.target.value);
          }}
          helperText={formValues.ci.invalid && formValues.ci.validateText}
          color={formValues.ci.invalid ? 'failure' : 'gray'}
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
          <Button pill color='failure' onClick={() => cancelAction()}>
            Cancelar
          </Button>
        </Tooltip>

        <Tooltip content={'Editar Observador'} className='dark:bg-white dark:text-black'>
          <Button pill onClick={() => validateForm()}>
            Editar
          </Button>
        </Tooltip>
      </div>
    </Fragment>
  );
};
