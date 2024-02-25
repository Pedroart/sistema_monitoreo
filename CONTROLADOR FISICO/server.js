import { error } from 'console';
import Modbus from 'jsmodbus';
import net from 'net';
import util from 'util'

async function modbusReader(host, address, port = 502) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const client = new Modbus.client.TCP(socket);
        const options = {
            'host': host,
            'port': port
        };

        socket.on('connect', () => {
            const promesaLectura = client.readInputRegisters(address, 1);
            promesaLectura.then(resp => {
                resolve({'status':'100','data':resp.response.body});
                socket.end();
            }).catch(err => {
                resolve({'status':'200','data':err.response});
                socket.end();
            });
        });

        socket.on('error', error => {
            reject(error);
            socket.end();
        });

        socket.connect(options);
    });
}

// Uso de la función generalizada
//const respuesta = await modbusReader('192.168.1.120', 101);
//console.log(respuesta);