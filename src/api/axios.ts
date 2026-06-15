import axios from "axios";
import { ip } from "../ip";

const BASE_URL=ip


export default axios.create({
    baseURL:BASE_URL
})

export const axiosPrivate=axios.create({
    baseURL:BASE_URL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true
})