import { AxiosIstance } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helper/util";

function createInstance(): AxiosIstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosIstance
}

const axios = createInstance()

export default axios
