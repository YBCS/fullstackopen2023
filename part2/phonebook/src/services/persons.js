import axios from "axios";
const baseUrl = "/api/persons"; /* for production */
// const baseUrl = "http://localhost:3001/api/persons"; /* for local dev */

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default {
  getAll,
  create,
  update,
  remove,
};
