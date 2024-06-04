import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { UserService } from './services';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [UserService, SwPush, HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  private key: string =
    'BMvHH5oxO1Oo4Y3xb4JH5zHA-Rnpkc8V1TP173STEgFg0GT_KaUFYy_s77EDg3GEOmGck8Ahqpz_i-k7dyyRse4';

  private permissions: any = undefined;

  constructor(private swPush: SwPush, private userSrv: UserService) {}

  public form: FormGroup = new FormGroup({
    user: new FormControl(null, [Validators.required]),
    course: new FormControl(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.checkPermissions();

    this.swPush.subscription.subscribe((res) => console.log(res));
  }

  checkPermissions = () => {
    this.swPush
      .requestSubscription({ serverPublicKey: this.key })
      .then((sub) => {
        console.log({ 'Subscription granted:': sub });
        this.permissions = sub;
      });
  };

  sendNotificationToUser = (): void => {
    const user: string = this.form.controls['user'].value;
    this.userSrv.sendPushNotifications(user).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  };

  sendNotificationToGroup = (): void => {
    const course: string = this.form.controls['course'].value;
    this.userSrv.sendPushNotificationsToGroup(course).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  };

  setPermissions = (): void => {
    const user = this.form.controls['user'].value;

    const obj: any = {
      user: user,
      credentials: this.permissions,
    };

    this.userSrv.savePermissions(obj).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  };
}
