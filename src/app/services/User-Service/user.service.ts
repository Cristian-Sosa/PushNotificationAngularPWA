import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  sendPushNotifications = (user: string): Observable<any> => {
    return this.http.post<any>(environment.url.concat('/notification/send'), {
      user: user,
    });
  };
  
  sendPushNotificationsToGroup = (course: string): Observable<any> => {
    return this.http.post<any>(environment.url.concat('/notification/sendGroup'), {
      course: course,
    });
  };

  savePermissions = (obj: any): Observable<any> => {
    return this.http.put<any>(
      environment.url.concat('/notification/savePermissions'),
      obj
    );
  };
}
