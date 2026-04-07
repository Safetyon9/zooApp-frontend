import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../services/utente-services';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-pwd.html',
  styleUrl: './change-pwd.css',
})
export class ChangePwd {
  msg = signal('');

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
      userName: this.auth.grant().userId,
      oldPwd: updatePwd.value.oldpassword,
      newPwd: updatePwd.value.newpassword
    }).subscribe({
      next: () => {
        this.routing.navigate(['/utente']); 
      },
      error: (r: any) => {
        this.msg.set(r.error.msg);
      }
    });
  }
}