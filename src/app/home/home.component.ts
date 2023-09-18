
import {User} from "../models";
import {UserService} from "../servicies";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Component, ElementRef, ViewChild} from "@angular/core";
import {first} from "rxjs/operators";


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  comment = ''
  videoId = '';
  user: User;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.updateForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      userId: this.user.id,
      password: [this.user.password, Validators.required],
      country: [this.user.country, Validators.required],
      jobTimeInMinutes: [this.user.jobTimeInMinutes, Validators.required],
    });
    this.userService.getYoutubeData().subscribe(value => {
      if (value) {
        this.comment = value.mostPopularComment;
        this.videoId = value.videoId;
      }
    });
  }
  get f() {
    return this.updateForm.controls;
  }

  update() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }

    this.loading = true;
    const user =  {
      id: this.f.userId.value,
      username: this.f.username.value,
      password: this.f.password.value,
      country: this.f.country.value,
      jobTimeInMinutes: this.f.jobTimeInMinutes.value
    }
    this.userService.update(user)
      .pipe(first())
      .subscribe(
        () => {
          this.user.country = user.country;
          this.user.jobTimeInMinutes = user.jobTimeInMinutes;
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
