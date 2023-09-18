import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from "../models";
import {environment} from "../../environments/environment";


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    var authData = this.createBasicAuthToken(username, password);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authData
    });
    let options = {headers: headers};
    return this.http.get<any>(`${environment.apiUrl}/api/auth/authorize`, options)
      .pipe(map(user => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = authData;
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  createBasicAuthToken(username: String, password: String) {
    return 'Basic ' + btoa(username + ":" + password)
  }
}
