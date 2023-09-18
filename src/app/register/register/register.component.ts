import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import {UserService} from "../../servicies";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      country: ['', Validators.required],
      jobTimeInMinutes: ['', Validators.required],
    });
  }

  navigate(path) {
    this.router.navigate([path])
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
     this.userService.save({
       id: null,
       username: this.f.username.value,
       password: this.f.password.value,
       country: this.f.country.value,
       jobTimeInMinutes: this.f.jobTimeInMinutes.value
     })
       .pipe(first())
       .subscribe(
         data => {
           this.router.navigate(['login']);
         },
         error => {
           this.error = error;
           this.loading = false;
         });
  }

}
