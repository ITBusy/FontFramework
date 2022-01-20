import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.setTimeOut();
  }
  randomNum() {
    "use strict";
    return Math.floor(Math.random() * 9) + 1;
  }
  loop1: any;
  loop2: any;
  loop3: any;
  time = 30;
  i = 0;
  @ViewChild('thirdDigit') selector3!: ElementRef;
  @ViewChild('secondDigit') selector2!: ElementRef;
  @ViewChild('firstDigit') selector1!: ElementRef;

  setTimeOut() {
    const _this = this;
    this.loop3 = setInterval(() => {
      "use strict";
      if (_this.i > 40) {
        clearInterval(_this.loop3);
        _this.selector3.nativeElement.textContent = 4;
      } else {
        _this.selector3.nativeElement.textContent = _this.randomNum();
        _this.i++;
      }
    }, _this.time);
    this.loop2 = setInterval(() => {
      "use strict";
      if (_this.i > 80) {
        clearInterval(_this.loop2);
        _this.selector2.nativeElement.textContent = 0;
      } else {
        _this.selector2.nativeElement.textContent = _this.randomNum();
        _this.i++;
      }
    }, _this.time);
    this.loop1 = setInterval(() => {
      "use strict";
      if (_this.i > 100) {
        clearInterval(_this.loop1);
        _this.selector1.nativeElement.textContent = 4;
      } else {
        _this.selector1.nativeElement.textContent = _this.randomNum();
        _this.i++;
      }
    }, _this.time);
  }
}
