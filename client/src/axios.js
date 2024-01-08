import axios from "axios"
export const makeRequest = axios.create({
    baseURL:"https://grayweb-backend.vercel.app/Server",
    withCredentials:true,
})