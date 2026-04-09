import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../../../core/services/utente-services';

@Component({
  selector: 'app-admin-change-pwd',
  standalone: false,
  templateUrl: './admin-change-pwd.html',
  styleUrl: './admin-change-pwd.css',
})
export class AdminChangePwd {
  msg = signal('');
  success = signal(false)

  constructor(
    private auth: AuthServices,
    private accountServices: UtenteServices,
    private routing: Router
  ) { }

  onSubmit(updatePwd: NgForm) {
    this.msg.set('');

    if (updatePwd.value.newpassword !== updatePwd.value.cntrlpassword) {
      this.msg.set('Password non identiche.');
      return;
    }

    this.accountServices.changePwd({
      username: this.auth.grant().userId,
      oldPwd: updatePwd.value.oldpassword,
      newPwd: updatePwd.value.newpassword
    }).subscribe({
      next: () => {
        this.success.set(true);
        this.msg.set('Password cambiata con successo!');
        setTimeout(() => {
          this.routing.navigate(['/utente']);
        }, 2000);
      },
      error: (r: any) => {
        this.msg.set(r.error.msg);
      }
    });
  }
}
