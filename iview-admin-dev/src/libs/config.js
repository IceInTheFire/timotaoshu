import env from "../../build/env";
import config from "../config"
const ajaxUrl = env === 'development'
    // ? 'http://localhost:3000'
    ? config.apiServer
    : env === 'production'
        ? config.apiServer
        : config.apiServer;


export default {
    apiUrl: ajaxUrl
}