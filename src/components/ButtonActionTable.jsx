import React from 'react';
import { Button, Tooltip } from 'flowbite-react';
import { GoTrash, GoPencil, GoCheck } from 'react-icons/go';

export const ButtonActionTable = ({
  deleteAction = null,
  deleteTooltipMessage = 'Eliminar Registro',
  editAction = null,
  approveRequest = null,
}) => {
  return (
    <div className='flex flex-row justify-center gap-2'>
      {deleteAction && (
        <Tooltip content={deleteTooltipMessage} className='dark:bg-white dark:text-black'>
          <Button outline pill color={'failure'} onClick={() => deleteAction()}>
            <GoTrash />
          </Button>
        </Tooltip>
      )}

      {editAction && (
        <Tooltip content={'Editar Registro'} className='dark:bg-white dark:text-black'>
          <Button outline pill onClick={editAction}>
            <GoPencil />
          </Button>
        </Tooltip>
      )}

      {approveRequest && (
        <Tooltip content={'Aprobar Solicitud'} className='dark:bg-white dark:text-black'>
          <Button outline pill color={'success'} onClick={approveRequest}>
            <GoCheck />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
