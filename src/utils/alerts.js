import Swal from 'sweetalert2';

/**
 * showBasicAlert
 * @param {string} title - Título de la alerta
 * @param {string} icon - Icono de la alerta ('success', 'error', 'warning', 'info', 'question')
 * @param {string} text - Texto de la alerta
 * @returns {Swal Alert}
 */

export const showBasicAlert = (title = '', icon = '', text = '') =>
  Swal.fire({
    icon: icon,
    title: title,
    backdrop: 'rgba(0,0,0,0.8)',
    text: text,
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
    confirmButtonColor: '#1a54d4',
  });

/**
 * showOptionsAlert
 * @param {string} title - Título de la alerta
 * @param {string} icon - Icono de la alerta ('success', 'error', 'warning', 'info', 'question')
 * @param {string} text - Texto de la alerta
 * @param {string} confirmButtonText - Texto del boton de confirmar
 * @param {string} cancelButtonText - Texto del boton de cancelar
 * @returns {boolean}
 */

export const showOptionsAlert = async (
  title = '¿Estás seguro de realizar esta acción?',
  icon = 'warning',
  text = 'Esta acción es ireversible',
  confirmButtonText = 'Si',
  cancelButtonText = 'No'
) => {
  const result = await Swal.fire({
    title: title,
    icon: icon,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#1a54d4',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    backdrop: 'rgba(0,0,0,0.8)',
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
  });

  return result?.isConfirmed;
};

/**
 * Alert whit React
 * @param {string} title - título
 * @param {string} icon - success | error | warning | info | question
 * @param {string} text - texto
 * @param {function} handleOk - función que se ejecuta al dar click en el botón de confirmar
 */
export const showAlert = ({ title = '', icon = '', text = '', handleOk = () => {} }) => {
  Swal.fire({
    title: title,
    icon: icon,
    text: text,
  }).then(() => {
    handleOk();
  });
};
