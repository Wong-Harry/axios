import { isPlainObject } from "./util";

export function transformReqest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data

}
