

export const isnull = (value) => {
    return (typeof value === "undefined" || value === null || value === '' || value == '');
}
export const isLetter =(str) => {
  return str.length === 1 && str.match(/[a-z]/i);
}

export const isNumeric =(num) =>{
  return Number(parseFloat(num))==num;
}

export const formatDateDDMMYYYY = (d = new Date)=> {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}/${month}/${year}`;
}

export const formatDateHHMM = (d = new Date)=> {
  let hour = String(d.getHours() );
  let minute = String(d.getMinutes());

  if (hour.length < 2) hour = '0' + hour;
  if (minute.length < 2) minute = '0' + minute;

  return `${hour}:${minute}`;
}

export const getYear = (fecha) => {
    if (!isnull(fecha)){
        return (fecha.substring(6, 10));
    }else{
        return ''
    }   
}
export const  getYearNow = () => {
  var f = new Date();    
  return (f.getFullYear());
}

export const getMonth = (fecha) => {
    if (!isnull(fecha)){
        return (fecha.substring(3, 5));
    }else{
        return ''
    }   
}
export const getMonthNow = () => {
  var f = new Date();
  return (f.getMonth()+1);
}

export const fnNombreMes = (pMes) => {

  var vNombreMes;

  vMes= (isnull(pMes))?-1: parseInt(pMes)

  switch (vMes) {
      case 1:
          vNombreMes='Enero';
          break;
      case 2:
          vNombreMes = 'Febrero';
          break;
      case 3:
          vNombreMes = 'Marzo';
          break;
      case 4:
          vNombreMes = 'Abril';
          break;
      case 5:
          vNombreMes = 'Mayo';
          break;
      case 6:
          vNombreMes = 'Junio';
          break;
      case 7:
          vNombreMes = 'Julio';
          break;
      case 8:
          vNombreMes = 'Agosto';
          break;
      case 9:
          vNombreMes = 'Septiembre';
          break;
      case 10:
          vNombreMes = 'Octubre';
          break;
      case 11:
          vNombreMes = 'Noviembre';
          break;
      case 12:
          vNombreMes = 'Diciembre';
          break;
      default:
          vNombreMes = '';
  }

  return vNombreMes;

}

export const fnSortArray_AñoMes =(arr)=>{
     var arrSort= arr.sort((a,b)=> {return (a.año+a.mes < b.año+b.mes) ? 1 : ((b.año+b.mes < a.año+a.mes) ? -1 : 0);} ); 
     return arrSort;
}
