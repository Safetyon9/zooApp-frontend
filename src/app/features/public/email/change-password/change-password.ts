import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UtenteServices } from '../../../../core/services/utente-services';

@Component({
  standalone: false,
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  token = '';
  loading = false;
  errore = '';
  messaggio = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private utenteServices: UtenteServices
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetForm = this.fb.group(
      {
        newPwd: ['', [Validators.required, Validators.minLength(6)]],
        confirmPwd: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const pwd = form.get('newPwd')?.value;
    const confirm = form.get('confirmPwd')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.errore = '';
    this.messaggio = '';

    if (!this.token) {
      this.errore = 'Token non valido.';
      return;
    }

    if (this.resetForm.invalid) {
      this.errore = 'Controlla i campi inseriti.';
      return;
    }

    this.loading = true;

    const req = {
      token: this.token,
      newPwd: this.resetForm.value.newPwd
    };

    this.utenteServices.changePassword(this.token, this.pwd).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.messaggio = resp?.msg || 'Password aggiornata correttamente.';
        this.resetForm.reset();
      },
      error: (err: any) => {
        this.loading = false;
        this.errore = err?.error?.msg || 'Errore durante il reset password.';
      }
    });
  }

  tornaAlLogin(): void {
    this.router.navigate(['/login']);
  }
}