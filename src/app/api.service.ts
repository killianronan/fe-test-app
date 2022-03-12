import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = "http://localhost:3000/users"

  constructor(private httpClient: HttpClient) { }

  getUsers(limit){
    return this.httpClient.get(this.url+"?limit="+limit.toString()).pipe(catchError((error: HttpErrorResponse) => throwError(error)))
  }
  
  postUser(body: any){
    return this.httpClient.post<any>(this.url, body).pipe(catchError((error: HttpErrorResponse) => throwError(error)))
  }
}
