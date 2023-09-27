import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RpcService {
  constructor(private http: HttpClient) {}

  url = 'http://localhost:8000/RPC2';

  fazerSolicitacaoXmlRpc(param1: number, param2: number): Observable<any> {
    const xmlRpcRequest = `<?xml version="1.0" encoding="UTF-8"?>
      <methodCall>
        <methodName>multiplicar</methodName>
        <params>
          <param>
            <value><int>${param1}</int></value>
          </param>
          <param>
            <value><int>${param2}</int></value>
          </param>
        </params>
      </methodCall>`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
      }),
      reponseType: 'text/plain',
    };

    return this.http.post<string>(this.url, xmlRpcRequest, httpOptions);
  }

  testRequest(): Observable<any> {
    const xmlRpcRequest = `<?xml version="1.0" encoding="UTF-8"?>
      <methodCall>
        <methodName>testRequest</methodName>
      </methodCall>`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/xml',
      }),
    };

    return this.http.post<string>(this.url, xmlRpcRequest, httpOptions);
  }
}
