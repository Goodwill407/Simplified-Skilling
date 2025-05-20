import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  // apiURL = 'http://192.168.0.103:4001/v1/';
  // apiURL = 'http://143.244.136.201:4001/v1/'; // development
  //  apiURL = 'http://64.227.147.34:4001/v1/'; // productionn of LMS
   apiURL = 'http://64.227.151.181:3005/v1/'; // New URL for Simplified Skilling

  constructor(private http: HttpClient) { }

  post(url: string, data: any) {
    return this.http.post<any>(this.apiURL + url, data);
  }

  patch(url: string, data: any) {
    const type = Object.getPrototypeOf(data);
    let id: any;
    if (type.append) {
      const stringifyId = JSON.stringify(Object.fromEntries(data));
      const pasrseId = JSON.parse(stringifyId);
      id = pasrseId.id;
      data.delete("id");
    } else {
      id = data.id;
      delete data.id;
    }
    return this.http.patch<any>(this.apiURL + url + "/" + id, data);
  }

  patchForAsset(url: string, data: any) {
    const scode = data.scode;
    const assetId = data.assetId;
    const queryString = `scode=${scode}&assetId=${assetId}`;
    delete data.id;
    delete data.scode;
    const apiUrl = `${this.apiURL}${url}?${queryString}`;
    return this.http.patch<any>(apiUrl, data);
  }

  get(url: string) {
    return this.http.get<any>(this.apiURL + url);
  }

  getById(url: string, id: string) {
    return this.http.get<any>(this.apiURL + url + "/" + id);
  }

  delete(url: string, id: any) {
    return this.http.delete<any>(this.apiURL + url + "/" + id);
  }
}
