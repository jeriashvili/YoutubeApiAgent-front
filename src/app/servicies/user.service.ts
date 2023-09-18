import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {User} from "../models";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {YoutubeData} from "../models/youtube-data";

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

  save(user: User) {
    return this.http.post<User>(`${environment.apiUrl}/api/users/register`, user);
  }

  update(user: User) {
    return this.http.patch<void>(`${environment.apiUrl}/api/users`, {country: user.country, jobTimeInMinutes: user.jobTimeInMinutes});

  }

  getYoutubeData() {
    return this.http.get<YoutubeData>(`${environment.apiUrl}/api/users/youtube-data`);
  }
}
