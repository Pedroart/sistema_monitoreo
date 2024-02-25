// Importar el módulo jsonFileManager
import {saveFile,readFile} from './app/data/FileManager.js'
import {modbusReader} from './app/modbus/startSocket.js'

// Ruta del archivo donde se guardará el JSON
const filePath = './app/data/llamadas.json';
//saveFile(filePath,Dispositivos);
const data = await readFile(filePath);

const subgrupos = data.reduce((acumulador, elemento) => {
  const clave = elemento.ITER;
  if (!acumulador[clave]) {
    acumulador[clave] = [];
  }
  acumulador[clave].push(elemento);
  return acumulador;
}, {});

var intervalos = [];

for (const clave in subgrupos) {
  //if (Object.hasOwnProperty.call(subgrupos, clave))
  const valorIntervalo = clave;
  let intervalo = setInterval(EJECUCION, valorIntervalo, subgrupos[valorIntervalo]);
  intervalos.push(intervalo);
  
}

function procezado(data,operador){
  let nuevooperador=operador.replace('#',data);
  return eval(nuevooperador);
}

function obtenerData(respuesta, item) {
  if (respuesta.status !== '100') return false;

  if (item.TRAN !== '') {
      return procezado(respuesta.data.values[0], item.TRAN);
  } else {
      return respuesta.data.values[0];
  }
}

async function EJECUCION(listado) {
  let respuestas = [];

  for (const item of listado) {
      const respuesta = await modbusReader(item.ip, item.DIR);
      const data = obtenerData(respuesta, item);

      const respuestaFormateada = {
          "IP": item.ip,
          "DIR": item.DIR,
          "Data": data,
          "Date": Date.now()
      };

      respuestas.push(respuestaFormateada);
  }

  console.log(respuestas);
}