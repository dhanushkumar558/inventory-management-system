import axios from 'axios';

const API = axios.create({ baseURL: 'https://inventory.boltxgaming.com/api' });

export default API;
