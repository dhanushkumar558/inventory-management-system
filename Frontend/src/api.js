import axios from 'axios';

const API = axios.create({ baseURL: 'http://inventory.boltxgaming.com/api' });

export default API;
