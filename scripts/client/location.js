import Swal from './modal'
export default function getLocation(setLoc) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLoc, (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          Swal.fire({
            title: 'Location Required',
            html: "To be able to use YouBarter, we need to know your location.  Please enable location services in your browser settings.  After you have applied the changes, please refresh the page.",
            showConfirmButton: false,
            showCancelButton: false
          })
          break;
        case error.POSITION_UNAVAILABLE:
          Swal.fire({
            title: 'Position Unavailable',
            html: "We couldn't detect your location.  Please ensure that location services are allowed in your browser settings.  Please note that to use YouBarter, we have to know your location.  After you have applied the changes, please refresh the page.",
            showConfirmButton: false,
            showCancelButton: false
          })
          break;
        case error.TIMEOUT:
          Swal.fire({
            title: 'Location Timed Out',
            html: "We weren't able to detect your location in time.  Please refresh the page and make sure that you have enabled location services in your browser settings.  Please note that we need to know your location before you can use YouBarter.",
            showConfirmButton: false,
            showCancelButton: false
          })
          break;
        case error.UNKNOWN_ERROR:
          Swal.fire({
            title: 'Unknown Error',
            html: "We don't know what happened, but we are unable to get your location.  Please refresh the page and make sure that you have enabled location services in your browser settings.",
            showConfirmButton: false,
            showCancelButton: false
          })
          break;
      }
    });
  } else {
    Swal.fire({
      title: "Location Unsupported",
      html: "To be able to use YouBarter, we have to be able to view your location.  It seems as though your browser does not support the ability to get your location.  Please use a different browser that supports this feature.",
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
  }
}