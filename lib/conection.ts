const url : string = "http://127.0.0.1:5000/"


export async function fetchDevices() {
    try {
        const res = await fetch(`${url}devices`);
        if (!res.ok) {
            throw new Error(res.status === 404 ? "Dispositivos no encontrados" : "Error en la solicitud");
        }
        const data = await res.json();
        console.log(data); 
    } catch (error) {
        console.error('Error:', error);
    }
}



export async function fetchAddDevice() {
    try {
        const res = await fetch(`${url}devices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const data = await res.json();
        console.log(data.device_id);
        console.log('Respuesta:', data);
        return data.device_id;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function fetchSearchMatch(id: string) {
  const res = await fetch(`${url}matches`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({}) })
.then(response => response.json())
.then(data => {
  console.log('Respuesta:', data);
})
.catch(error => {
  console.error('Error:', error);
});
}




export async function fetchStarshipById(id: string) {
  const res = await fetch(`${url}`);
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Nave no encontrada" : "Error en la solicitud");
  }
  return res.json();
}
