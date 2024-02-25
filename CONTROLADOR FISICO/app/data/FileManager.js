import fs from 'fs-extra'

export async function saveFile(filePath, dataToSave) {
    try {
      // Convertir el objeto JSON en una cadena JSON
      const jsonData = JSON.stringify(dataToSave, null, 2);
      // Guardar el JSON en el archivo
      await fs.writeFile(filePath, jsonData);
    } catch (error) {
        return {
            'Respuesta': '500' ,
            'mensaje': error
        }
    }
    return { 
        'respuesta': '200',
        'mensaje': 'guardado correctamente'
    }
  }

export async function readFile(filePath){
    try{
        // Leer el archivo JSON
        const data = await fs.readFile(filePath, 'utf8');
        // Parsear el JSON a un objeto JavaScript
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        return {
            'Respuesta': '500' ,
            'mensaje': error
        }
    }
    
}

