import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountInterface } from '../interface/account.interface';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(
    private formGroup: FormBuilder,
    private ele: ElementRef,
    private router: Router,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.scripts();
    this.valiForm = this.formGroup.group({
      'username': new FormControl('', [Validators.required, Validators.minLength(5)]),
      'password': new FormControl('', [Validators.required,
      Validators.pattern('[A-Z][a-z]+[0-9]+(\\w)*')]),
      'fullname': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'birthday': [''],
      'gender': [''],
      'schoolfee': [''],
      'mark': ['']
    });
    this.addClass();
    this.LoginForm = this.formGroup.group({
      'username': [''],
      'password': ['']
    });
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home', 1]);
    }
  }

  name!: string;
  valiForm: FormGroup | any;
  LoginForm: FormGroup | any;
  public Account: AccountInterface[] = [];
  @ViewChild('SignUp') SignUp!: ElementRef;
  @ViewChild('SignIn') SignIn!: ElementRef;
  @ViewChild('Login_container') Login_container!: ElementRef;

  scripts() {
    const sign_in_btn = this.ele.nativeElement.querySelector('#sign-in-btn');
    const sign_up_btn = this.ele.nativeElement.querySelector('#sign-up-btn');
    const container = this.ele.nativeElement.querySelector('.Login__container');

    sign_up_btn.addEventListener('click', () => {
      container.classList.add('sign-up-mode');
    })
    sign_in_btn.addEventListener('click', () => {
      container.classList.remove('sign-up-mode');
    });
    // password
    const passField = this.ele.nativeElement.querySelectorAll("input.show-pass");
    const showBtn = this.ele.nativeElement.querySelectorAll("span.show-btn i");
    const span = this.ele.nativeElement.querySelectorAll("span.show-btn");
    for (let i = 0; i < showBtn.length; i++) {
      showBtn[i].onclick = (() => {
        if (passField[i].type === "password") {
          passField[i].setAttribute("type", "text");
          showBtn[i].classList.add("hide-btn");
        } else {
          passField[i].setAttribute("type", "password");
          showBtn[i].classList.remove("hide-btn");
        }
      });
    }
  }
  valid(str: string) {
    switch (str) {
      case 'username':
        str = 'username';
        break;
      case 'password':
        str = 'password';
        break;
      case 'email':
        str = 'email';
        break;
      case 'fullname':
        str = 'fullname';
        break;
      default:
        break;
    }
    return this.valiForm.get(str);
  }

  getMessageUsername() {
    if (this.valid('username')?.hasError('required')) {
      return 'Username cannot be empty!';
    } else if (!this.valid('username')?.hasError('minLenth')) {
      return 'Username must be more than 5 characters long!';
    } else if (this.valiForm.value.username) {
      return 'Username already exists';
    } else {
      return '';
    }
  }
  getMessagePassword() {
    if (this.valid('password')?.hasError('required')) {
      return 'Password cannot be empty!';
    } else if (this.valid('password')?.hasError('pattern')) {
      return 'Password must consist alphanumerics and the first letter must be capitalized!';
    } else {
      return '';
    }
  }
  getMessageFullName() {
    if (this.valid('fullname')?.hasError('required')) {
      return 'Full name cannot be empty!';
    } else {
      return '';
    }
  }
  getMessageEmail() {
    if (this.valid('email')?.hasError('required')) {
      return 'Email cannot be empty!';
    } else if (this.valid('email')?.hasError('email')) {
      return 'Please enter your email address correctly!';
    } else {
      return '';
    }
  }

  addClass() {
    var a = this.ele.nativeElement.querySelectorAll('input.form__input');
    var b = a.length;
    for (var i = 0; i < b; i++) {
      a[i].addEventListener('click', (e: any) => {
        if (e.target.value.length === 0) {
          e.target.classList.add('NotEmpty');
        } else {
          if ((!this.valid('password')?.hasError('pattern') && e.target.name === 'password')
            || (e.target.value.length > 10 && e.target.name === 'username')
            || (!this.valid('email')?.hasError('email') && e.target.name === 'email')
            || (!this.valid('fullname')?.hasError('requied') && e.target.name === 'fullname')) {
            e.target.classList.remove('NotEmpty');
          } else {
            e.target.classList.add('NotEmpty');
          }
        }
      });
      a[i].addEventListener('input', (e: any) => {
        if ((!this.valid('password')?.hasError('pattern') && e.target.name === 'password')
          || (e.target.value.length > 10 && e.target.name === 'username')
          || (!this.valid('email')?.hasError('email') && e.target.name === 'email')
          || (!this.valid('fullname')?.hasError('requied') && e.target.name === 'fullname')) {
          e.target.classList.remove('NotEmpty');
        } else {
          e.target.classList.add('NotEmpty');
        }
      });
    }
  }

  onLogin() {
    if (this.LoginForm.value.username === '' && this.LoginForm.value.password == '') {
      alert('Please enter username and password');
    } else if (this.LoginForm.value.username === '' || this.LoginForm.value.password === '') {
      alert(`Please enter ${this.LoginForm.value.username === '' ? 'username' : 'password'}`);
    } else {
      this.authService.getAccountJson().subscribe(res => {
        const user = res.find((user: any) => {
          return user.password === this.LoginForm.value.password
            && user.username === this.LoginForm.value.username;
        });
        if (user) {
          alert('Login successfully');
          this.authService.setToken('abcdefghijklmnopqrstuvwxyz');
          this.router.navigate(['home', 1]);
        } else {
          alert('Username or password incorrect');
        }
      });

    }
  }

  onSignUp() {
    if (this.valiForm.valid) {
      this.authService.getAccountJson().subscribe(res => {
        const user = res.find((u: any) => {
          console.log(u.username === this.valiForm.value.username);
          return u.username === this.valiForm.value.username;
        });
        if (user) {
          alert('Username already exists')
        } else {
          this.authService.AddAccount(this.valiForm.value).subscribe(res => {
            alert('Sign Up Successfully');
            this.valiForm.reset();
            this.Login_container.nativeElement.classList.remove('sign-up-mode');
          }, err => {
            alert('Sign Up Error');
          });
        }
      });
    } else {
      alert('Please enter information');
    }
  }
}
