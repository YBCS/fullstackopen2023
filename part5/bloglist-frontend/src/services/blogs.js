import axios from 'axios'

// const baseUrl = '/api/blogs' // for production
const baseUrl = "http://localhost:3003/api/blogs";
let token = null

const setToken = newToken => { /* INTERESTING */
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// NOTE : check what to return here
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }  
  const request = await axios.delete(`${ baseUrl }/${id}`, config)
  return request.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${ baseUrl }/${id}`, newObject)
  return response.data
}

export default { getAll, create, update, setToken, remove }