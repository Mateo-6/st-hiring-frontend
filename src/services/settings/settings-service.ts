import to from 'await-to-js';
import axios from 'axios';
import { MobileSetting } from '../../models/settings';

export async function getClientsId() {
  const [err, response] = await to(axios.get('http://localhost:3000/settings'));
  if (err) {
    console.log(err);
    throw err;
  }

  return response;
}

export async function getSettingsByClientId(clientId: number) {
  const [err, response] = await to(axios.get(`http://localhost:3000/settings/${clientId}`));
  if (err) {
    console.log(err);
    throw err;
  }

  return response;
}

export async function updateSettingsByClientId(data: MobileSetting) {
  const [err, response] = await to(axios.put(`http://localhost:3000/settings/${data.clientId}`, data));
  if (err) {
    console.log(err);
    throw err;
  }

  return response;
}
