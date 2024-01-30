import React, { Fragment, useState, useEffect } from 'react';
import { Button, Label, TextInput, Tooltip, Select, Checkbox } from 'flowbite-react';
import { utils, read } from 'xlsx';

import { useLoader } from '@/contexts/loader';

import { jrvService } from '@/services/jrv';

import { UploadExcelFile } from '../UploadExcelFile';

import { errorToast, successToast } from '@/utils/toast';
import { cleanText } from '@/utils/helpers';

import { initRegisterJrv } from '@/constants/forms';
import { DISTRICTS, GENDERS, PROVINCES, TYPE_PARISH, ZONES } from '@/constants';
import { EXCEL_FILE } from '@/constants';

export const JRVForm = ({
  closeModal = () => {},
  onFinish = async () => {},
  ballots = [],
  observers = [],
  jrv = null,
}) => {
  const { showLoader, hideLoader } = useLoader();

  const [formValues, setFormValues] = useState(initRegisterJrv);
  const [formBallots, setFormBallots] = useState(ballots);

  const changeFormValues = (prop, key, value) => {
    let _formValues = { ...formValues };
    _formValues[prop][key] = value;
    setFormValues(_formValues);
  };

  const handleCheckboxChange = (id, checked) => {
    changeFormValues('ballotsId', 'invalid', false);

    const data = formBallots.map((item) => {
      if (item?.PapeletaId === id) {
        item.checked = !checked;
      }

      return item;
    });

    setFormBallots(data);

    if (!checked) {
      let _formValues = { ...formValues };
      _formValues.ballotsId.value.push(id);
      setFormValues(_formValues);
    } else {
      let _formValues = { ...formValues };
      _formValues.ballotsId.value = _formValues.ballotsId.value.filter((item) => item !== id);
      setFormValues(_formValues);
    }
  };

  const validateForm = () => {
    let isValid = true;

    const _data = {};

    for (let key in formValues) {
      _data[key] = cleanText(formValues[key].value);
    }

    if (_data.number === '') {
      changeFormValues('number', 'invalid', true);
      isValid = false;
    }

    if (_data.gender === '') {
      changeFormValues('gender', 'invalid', true);
      isValid = false;
    }

    if (_data.place === '') {
      changeFormValues('place', 'invalid', true);
      isValid = false;
    }

    if (_data.parish === '') {
      changeFormValues('parish', 'invalid', true);
      isValid = false;
    }

    if (_data.typeParish === '') {
      changeFormValues('typeParish', 'invalid', true);
      isValid = false;
    }

    if (_data.canton === '') {
      changeFormValues('canton', 'invalid', true);
      isValid = false;
    }

    if (_data.province === '') {
      changeFormValues('province', 'invalid', true);
      isValid = false;
    }

    if (_data.number_of_voters === '') {
      changeFormValues('number_of_voters', 'invalid', true);
      isValid = false;
    }

    if (_data.userId === '') {
      changeFormValues('userId', 'invalid', true);
      isValid = false;
    }

    if (_data.ballotsId?.length < 1) {
      changeFormValues('ballotsId', 'invalid', true);
      isValid = false;
    }

    if (isValid) {
      handleService(_data);
    }
  };

  const handleService = async (data) => {
    showLoader();

    const response = jrv ? await jrvService.update(jrv.JRVId, data) : await jrvService.create(data);

    hideLoader();

    if (!response.error) {
      cleanFormValues();
      await onFinish();
      closeModal();
      successToast(`JRV ${jrv ? 'actualizada' : 'creada'} exitosamente!`);
    } else {
      errorToast(response.message);
    }
  };

  const configDataToEdit = () => {
    for (let key in initRegisterJrv) {
      changeFormValues(key, 'value', jrv[key]);
      changeFormValues(key, 'invalid', false);
    }

    let _ballots = [...formBallots];
    _ballots = _ballots.map((item) => {
      item.checked = jrv.ballotsId.includes(item.PapeletaId);
      return item;
    });

    setFormBallots(_ballots);
  };

  const cleanFormValues = () => {
    for (let key in initRegisterJrv) {
      changeFormValues(key, 'value', key === 'ballotsId' ? [] : '');
      changeFormValues(key, 'invalid', false);
    }
  };

  const cleanCheckboxs = () => {
    const data = formBallots.map((item) => ({ ...item, checked: false }));
    setFormBallots(data ?? []);
  };

  const handleCancelButton = () => {
    closeModal();
    cleanFormValues();
    cleanCheckboxs();
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
          const observer = observers.find(
            (ele) => ele?.Email?.trim()?.toLowerCase() === item?.Observador?.trim()?.toLowerCase()
          );

          const ballotsId = item?.Papeletas?.split(',')
            ?.map(
              (ele) =>
                ballots.find(
                  (ball) => ball?.Dignidad.trim()?.toLowerCase() === ele?.trim()?.toLowerCase()
                )?.PapeletaId
            )
            .filter((ele) => ele);

          if (
            item.Numero &&
            item.Genero &&
            item.Recinto &&
            item.Parroquia &&
            item.TipoParroquia &&
            item.Canton &&
            item.Provincia &&
            item.Votantes &&
            item.Observador &&
            observer &&
            item.Papeletas &&
            Array.isArray(ballotsId) &&
            ballotsId.length > 0
          ) {
            insertData.push({
              number: item.Numero,
              gender: item.Genero,
              address: item.Direccion ?? '',
              place: item.Recinto,
              zone: item.Zona ?? '',
              parish: item.Parroquia,
              typeParish: item.TipoParroquia,
              canton: item.Canton,
              district: item.Circunscripcion ?? '',
              province: item.Provincia,
              number_of_voters: item.Votantes,
              userId: observer.UsuarioId,
              ballotsId: ballotsId,
            });
          }
        });

        let succesCount = 0;

        for (let i = 0; i < insertData.length; i++) {
          const response = await jrvService.create(insertData[i]);

          if (!response.error) {
            succesCount++;
          }
        }

        hideLoader();

        await onFinish();

        closeModal();

        successToast(`${succesCount} JRVs de ${excelData.length} fueron registrados exitosamente!`);

        errorToast(
          `${excelData.length - insertData.length} JRVs de ${
            excelData.length
          } no pudieron ser registrados!`
        );
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    cleanCheckboxs();

    if (jrv !== null) {
      configDataToEdit();
    } else {
      cleanFormValues();
    }
  }, [jrv]);

  return (
    <Fragment>
      <UploadExcelFile text='Registrar JRVs por Excel' upload={handleFileUpload} />

      <div className='mb-4'>
        <Label
          htmlFor='number'
          value='Número:'
          color={formValues.number.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='number'
          required
          shadow
          type='number'
          value={formValues.number.value}
          onChange={(e) => {
            changeFormValues('number', 'value', e.target.value);
            changeFormValues('number', 'invalid', false);
          }}
          helperText={formValues.number.invalid && formValues.number.validateText}
          color={formValues.number.invalid ? 'failure' : 'gray'}
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

      <div className='mb-4'>
        <Label
          htmlFor='address'
          value='Dirección:'
          color={formValues.address.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='address'
          placeholder='Calle 12 y Av. 14'
          required
          shadow
          type='text'
          value={formValues.address.value}
          onChange={(e) => {
            changeFormValues('address', 'value', e.target.value);
            changeFormValues('address', 'invalid', false);
          }}
          helperText={formValues.address.invalid && formValues.address.validateText}
          color={formValues.address.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='place'
          value='Recinto:'
          color={formValues.place.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='place'
          placeholder='Colegio Manta'
          required
          shadow
          type='text'
          value={formValues.place.value}
          onChange={(e) => {
            changeFormValues('place', 'value', e.target.value);
            changeFormValues('place', 'invalid', false);
          }}
          helperText={formValues.place.invalid && formValues.place.validateText}
          color={formValues.place.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='zone'
          value='Zona Electoral:'
          color={formValues.zone.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='zone'
          className='mb-4'
          required
          shadow
          value={formValues.zone.value}
          onChange={(e) => {
            changeFormValues('zone', 'value', e.target.value);
            changeFormValues('zone', 'invalid', false);
          }}
          helperText={formValues.zone.invalid && formValues.zone.validateText}
          color={formValues.zone.invalid ? 'failure' : 'gray'}>
          {ZONES.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='parish'
          value='Parroquia:'
          color={formValues.parish.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='parish'
          placeholder='Nuevo Tarqui'
          required
          shadow
          type='text'
          value={formValues.parish.value}
          onChange={(e) => {
            changeFormValues('parish', 'value', e.target.value);
            changeFormValues('parish', 'invalid', false);
          }}
          helperText={formValues.parish.invalid && formValues.parish.validateText}
          color={formValues.parish.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='typeParish'
          value='Tipo de Parroquia:'
          color={formValues.typeParish.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='typeParish'
          className='mb-4'
          required
          shadow
          value={formValues.typeParish.value}
          onChange={(e) => {
            changeFormValues('typeParish', 'value', e.target.value);
            changeFormValues('typeParish', 'invalid', false);
          }}
          helperText={formValues.typeParish.invalid && formValues.typeParish.validateText}
          color={formValues.typeParish.invalid ? 'failure' : 'gray'}>
          {TYPE_PARISH.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='canton'
          value='Cantón:'
          color={formValues.canton.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='canton'
          placeholder='Manta'
          required
          shadow
          type='text'
          value={formValues.canton.value}
          onChange={(e) => {
            changeFormValues('canton', 'value', e.target.value);
            changeFormValues('canton', 'invalid', false);
          }}
          helperText={formValues.canton.invalid && formValues.canton.validateText}
          color={formValues.canton.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='district'
          value='Circunscripción:'
          color={formValues.district.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='district'
          className='mb-4'
          required
          shadow
          value={formValues.district.value}
          onChange={(e) => {
            changeFormValues('district', 'value', e.target.value);
            changeFormValues('district', 'invalid', false);
          }}
          helperText={formValues.district.invalid && formValues.district.validateText}
          color={formValues.district.invalid ? 'failure' : 'gray'}>
          {DISTRICTS.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='province'
          value='Provincia:'
          color={formValues.province.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='province'
          className='mb-4'
          required
          shadow
          value={formValues.province.value}
          onChange={(e) => {
            changeFormValues('province', 'value', e.target.value);
            changeFormValues('province', 'invalid', false);
          }}
          helperText={formValues.province.invalid && formValues.province.validateText}
          color={formValues.province.invalid ? 'failure' : 'gray'}>
          {PROVINCES.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='number_of_voters'
          value='Cantidad de Votantes:'
          color={formValues.number_of_voters.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <TextInput
          id='number_of_voters'
          required
          shadow
          type='number'
          value={formValues.number_of_voters.value}
          onChange={(e) => {
            changeFormValues('number_of_voters', 'value', e.target.value);
            changeFormValues('number_of_voters', 'invalid', false);
          }}
          helperText={
            formValues.number_of_voters.invalid && formValues.number_of_voters.validateText
          }
          color={formValues.number_of_voters.invalid ? 'failure' : 'gray'}
        />
      </div>

      <div className='mb-4'>
        <Label
          htmlFor='userId'
          value='Observador:'
          color={formValues.userId.invalid ? 'failure' : 'gray'}
          className='dark:text-white'
        />

        <Select
          id='userId'
          className='mb-4'
          required
          shadow
          value={formValues.userId.value}
          onChange={(e) => {
            changeFormValues('userId', 'value', e.target.value);
            changeFormValues('userId', 'invalid', false);
          }}
          helperText={formValues.userId.invalid && formValues.userId.validateText}
          color={formValues.userId.invalid ? 'failure' : 'gray'}>
          {observers.map((item, index) => (
            <option key={index} value={item?.UsuarioId}>
              {item?.name}
            </option>
          ))}
        </Select>
      </div>

      <Label
        value='Lista de Papeletas:'
        color={formValues.ballotsId.invalid ? 'failure' : 'gray'}
        className='dark:text-white'
      />
      {formValues.ballotsId.invalid && (
        <p className='text-red-600 text-sm mb-2'>{formValues.ballotsId.validateText}</p>
      )}

      <div className='overflow-auto h-24 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100'>
        {formBallots?.map((item, index) => (
          <div key={index} className='flex flex-row justify-start gap-3 items-center my-1.5 pl-3'>
            <Checkbox
              id={index}
              checked={item?.checked}
              onChange={() => handleCheckboxChange(item?.PapeletaId, item?.checked)}
            />
            <Label htmlFor={index} value={item?.Dignidad} className='font-normal' />
          </div>
        ))}
      </div>

      <div className='w-100 flex justify-center items-center gap-4 mt-4'>
        <Tooltip content='Cancelar acción' className='dark:bg-white dark:text-black'>
          <Button pill color='failure' onClick={() => handleCancelButton()}>
            Cancelar
          </Button>
        </Tooltip>

        <Tooltip
          content={`${jrv ? 'Editar' : 'Crear'} jrv`}
          className='dark:bg-white dark:text-black'>
          <Button pill onClick={() => validateForm()}>
            {jrv ? 'Editar' : 'Crear'}
          </Button>
        </Tooltip>
      </div>
    </Fragment>
  );
};
