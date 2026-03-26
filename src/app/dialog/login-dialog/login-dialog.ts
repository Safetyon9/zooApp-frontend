import { Component, signal, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtenteServices } from '../../services/utente-services';
import { Router } from '@angular/router';
import { AuthServices } from '../../auth/auth-services';

@Component({
  selector: 'app-login-dialog',
  imports: [],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.css',
})
export class LoginDialog {

   msg = signal("");
  @ViewChild ('loginForm') loginForm:NgForm

  constructor(private utenteServices: UtenteServices, 
    private auth:AuthServices, 
    private routing: Router) {}

    onSubmit(){
      this.utenteServices.login({
      username: this.loginForm.form.value.username,
      pwd: this.loginForm.form.value.password
    }).subscribe({
      next: ((r:any)=>{
        this.msg.set("");
        console.log(r);
        this.auth.setAutentificated();

        if(r.ruolo == 'ADMIN')
          this.auth.setAdmin();
        else
          this.auth.setUser();

        this.routing.navigate(['home'])
      }),
      error: ((r:any)=>{
        this.msg.set(r.error.msg);
      })
    })

    }

    registrazione(){
      this.routing.navigate(['registra'])
    }


}
