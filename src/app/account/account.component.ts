import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private ele: ElementRef) { }

  ngOnInit(): void {
    this.scripts();
  }
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
}
