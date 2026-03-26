import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthServices } from '../../auth/auth-services';
import { UtenteServices } from '../../services/utente-services';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  msg = signal('');
  readonly dialog = inject(MatDialog);

  constructor(
    private auth: AuthServices,
    private accountServices: UtenteServices,
    private routing: Router,
    private dialogRef: MatDialogRef<ChangePassword>
  ) { }

  onSubmit(updatePwd: NgForm) {
    this.msg.set("");

    if (updatePwd.value.newpassword != updatePwd.value.cntrlpassword) {
      this.msg.set("password non identiche.")
      return
    }
    this.accountServices.changePwd({
      userName: this.auth.grant().userId,
      oldPwd: updatePwd.value.oldpassword,
      newPwd: updatePwd.value.newpassword
    }).subscribe({
      next: ((r: any) => {
        this.dialogRef.close();
      }),
      error: ((r: any) => {
        this.msg.set(r.error.msg);
      })
    })

  }
}
