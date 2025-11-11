const url: string = "http://127.0.0.1:5000/"



interface Stats {
  wins: String;
  losses: String;
  ratio: String;
}


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
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



export async function fetchStats(id: string): Promise<Stats> {
  try {
    const res = await fetch(`${url}devices/${id}/info`);

    if (!res.ok) {
      throw new Error(res.status === 404 ? "Dispositivos no encontrados" : "Error en la solicitud");
    }

    const data: Stats = await res.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error('Error en fetchStats:', error);
    throw error;
  }
}


export async function fetchWaitingStatus(id:string) {
  try{
    const res = await fetch(`${url}matches/waiting-status`);
    if (!res.ok){
      throw new Error(res.status === 404 ? "Dispositivo no encontrado":"error");
    }
    const data: Stats = await res.json();
    return data;
  }catch(error){

  }
  
}