import axios from 'axios'

// NOTE : services directory will potentially have multiple files; do I have to change the base URL for each file?
// const baseUrl = '/api/blogs' // for production
const baseUrl = "http://localhost:3003/api/login";

const login = (credentials) => {
  const request = axios.post(baseUrl, credentials)
  return request.then(response => response.data)
}

export default { login }