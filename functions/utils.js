function getDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let day = ("0" + now.getDate()).slice(-2);
    const date = [year, month, day].join("-");
    return date;
};

const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u0301\u0308\u030C]/g, "")
    .normalize();
};

function convertKM(latUsuario, lonUsuario, latTienda, lonTienda) {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
  
    const lat1 = degToRad(latUsuario);
    const lon1 = degToRad(lonUsuario);
    const lat2 = degToRad(latTienda);
    const lon2 = degToRad(lonTienda);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distancia = radioTierra * c;
    return distancia.toFixed(2);
  }
  
  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  function convertKMtoMeters(km) {
    if (km < 1) {
      const meters = km * 1000;
      return meters + " m";
    } else {
      return km + " km";
    }
  }

module.exports = {
    getDate: getDate,
    removeAccents: removeAccents,
    convertKM:convertKM,
    convertKMtoMeters:convertKMtoMeters
}