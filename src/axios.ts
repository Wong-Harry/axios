import { AxiosIstance, AxiosRequestConfig } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helper/util";
import defaults from "./defaults";

function createInstance(config: AxiosRequestConfig): AxiosIstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosIstance
}

const axios = createInstance(defaults)

export default axios
