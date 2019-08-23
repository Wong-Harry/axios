import { isPlainObject } from "./util";

export function transformReqest(data: any): any {
  if (isPlainObject(data)) {
    console.log(data);
    return JSON.stringify(data)
  }
  return data

}
