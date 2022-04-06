import Swil from 'sweetalert2';

const Swal = Swil.mixin({
  allowOutsideClick: false,
  showClass: {
    popup: ''
  },
  hideClass: {
    popup: ''
  }
});

export default Swal;