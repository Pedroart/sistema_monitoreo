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

async function EJECUCION(listado){
  for (const item of listado) {
    const respuesta = await modbusReader(item.ip, item.DIR);
    console.log(respuesta);
  }
}