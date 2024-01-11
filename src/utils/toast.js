import { toast } from 'sonner';

export const successToast = (message = 'Operación Exitosa!') => toast.success(message);

export const errorToast = (message = 'Ocurrió un problema!') => toast.error(message);
