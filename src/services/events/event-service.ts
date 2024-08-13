import axios from 'axios';
import to from 'await-to-js';

export async function getEvents() {
  const [err, response] = await to(axios.get('http://localhost:3000/events'));
  if (err) {
    console.log(err);
    throw err;
  }

  return response;
}
