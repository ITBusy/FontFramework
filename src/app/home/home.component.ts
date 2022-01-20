import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuizInterface } from '../interface/quiz.interface';
import { SubjectInterface } from '../interface/subject.interface';
import { AuthService } from '../service/auth/auth.service';
import { Service } from '../service/user/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private ele: ElementRef,
    private service: Service,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getSubject();
    this.totalPages = this.subjectInterface.length;
    this.getPage(1);
  }

  subb: string = '';
  public quizInterface: QuizInterface[] = [];
  public subjectInterface: SubjectInterface[] = [];
  subjectName: string = '';
  currentIndex: number = 0;
  userScore: number = 0;
  counter?: any;
  counterLine?: any;
  timeValue: number = 30;
  widthValue: number = 0;
  posCurQui: number = this.randomQuiz();
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('info_box') info_box!: ElementRef;
  @ViewChild('quiz_box') quiz_box!: ElementRef;
  @ViewChild('subject_title') subject_title!: ElementRef;
  @ViewChild('list_group') list_group!: ElementRef;
  @ViewChild('next_btn') next_btn!: ElementRef;
  @ViewChild('option_list') option_list!: ElementRef;
  @ViewChild('timeText') timeText!: ElementRef;
  @ViewChild('timeCount') timeCount!: ElementRef;
  @ViewChild('time_line') time_line!: ElementRef;
  @ViewChild('result_box') result_box!: ElementRef;
  @ViewChild('score_text') score_text!: ElementRef;


  totalPages: any;
  Page = 1;

  getQuiz() {
    this.service.getQuizJson(this.subb)
      .subscribe(res => {
        this.quizInterface = res;
      });
  }

  clickQuit(event: any) {
    this.info_box.nativeElement.classList.remove("activeInfo");//hide info box
    this.modal.nativeElement.style.display = "none";
  }

  continueBtn(event: any) {
    this.info_box.nativeElement.classList.remove("activeInfo"); //hide info box
    this.quiz_box.nativeElement.classList.add("activeQuiz"); //show quiz box
    this.subject_title.nativeElement.innerText = this.subjectName;
    this.startTimer(30); //calling startTimer function
    this.startTimerLine(0); //calling startTimerLine function
  }

  listSubject(event: any) {
    const ite = this.ele.nativeElement.querySelectorAll('.list_group_item');
    // const modal = this.ele.nativeElement.querySelector('.modal-quiz');
    // const info_box = this.ele.nativeElement.querySelector(".info_box");
    ite.forEach((e: any) => {
      if (e.classList.contains('modal-active')) {
        e.classList.remove('modal-active');
      }
    });
    event.target.classList.add('modal-active');
    this.modal.nativeElement.style.display = "flex";
    this.info_box.nativeElement.classList.add("activeInfo");
    this.subb = event.target.getAttribute('sub');
    this.getQuiz();
    this.subjectName = event.target.innerHTML;
  }
  getSubject() {
    const ul = this.ele.nativeElement.querySelector('ul.list-group');
    this.service.getSubjectJson().subscribe(res => {
      this.subjectInterface = res;
    });
  }

  nextQuiz() {
    if (this.currentIndex < 9) {
      this.currentIndex++;
      this.posCurQui = this.randomQuiz();
      this.next_btn.nativeElement.classList.remove('show');
      clearInterval(this.counter); //clear counter
      clearInterval(this.counterLine); //clear counterLine
      this.startTimer(this.timeValue); //calling startTimer function
      this.startTimerLine(this.widthValue); //calling startTimerLine function
    } else {
      clearInterval(this.counter); //clear counter
      clearInterval(this.counterLine); //clear counterLine
      this.showResult(); //calling showResult function
    }
  }

  selectAnswer(id: number, tags: any) {
    clearInterval(this.counter); //clear counter
    clearInterval(this.counterLine); //clear counterLine

    let tag;
    let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
    let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
    let correctAnswer = this.quizInterface[this.posCurQui].AnswerId; //getting correct answer from array
    const allOptions = this.option_list.nativeElement.children.length; //getting all option items

    if (tags.tagName == 'SPAN') {
      tag = tags.parentElement;
    } else {
      tag = tags;
    }

    if (id == correctAnswer) {
      this.userScore += this.quizInterface[this.posCurQui].Marks;
      tag.classList.add("correct"); //adding green color to correct selected option
      tag.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    } else {
      tag.classList.add("incorrect"); //adding red color to correct selected option
      tag.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option

      for (let i = 0; i < allOptions; i++) {
        if (this.option_list.nativeElement.children[i].children[0].getAttribute('answeri') == correctAnswer) { //if there is an option which is matched to an array answer 
          this.option_list.nativeElement.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          this.option_list.nativeElement.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        }
      }
    }
    for (let i = 0; i < allOptions; i++) {
      this.option_list.nativeElement.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    this.next_btn.nativeElement.classList.add("show"); //show the next button if user selected any option
  }
  startTimer(time: number) {
    this.counter = setInterval(() => {
      this.timeCount.nativeElement.textContent = time; //changing the value of timeCount with time value
      time--; //decrement the time value
      if (time < 9) { //if timer is less than 9
        let addZero = this.timeCount.nativeElement.textContent;
        this.timeCount.nativeElement.textContent = "0" + addZero; //add a 0 before time value
      }
      if (time < 0) { //if timer is less than 0
        clearInterval(this.counter); //clear counter
        this.timeText.nativeElement.textContent = "Time Off"; //change the time text to time off

        let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
        let correctAnswer = this.quizInterface[this.posCurQui].AnswerId; //getting correct answer from array
        const allOptions = this.option_list.nativeElement.children.length; //getting all option items

        for (let i = 0; i < allOptions; i++) {
          if (this.option_list.nativeElement.children[i].children[0].getAttribute('answeri') == correctAnswer) { //if there is an option which is matched to an array answer 
            this.option_list.nativeElement.children[i].setAttribute("class", "option correct"); //adding green color to matched option
            this.option_list.nativeElement.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          }
        }
        for (let i = 0; i < allOptions; i++) {
          this.option_list.nativeElement.children[i].classList.add("disabled"); //once user select an option then disabled all options
        }
        this.next_btn.nativeElement.classList.add("show"); //show the next button if user selected any option
      }
    }, 1000);
  }
  startTimerLine(time: number) {
    // const time_line = this.ele.nativeElement.querySelector("header .time_line");
    this.counterLine = setInterval(timer, 29);
    const _this = this;
    function timer() {
      time += 1; //upgrading time value with 1
      _this.time_line.nativeElement.style.width = time + "px"; //increasing width of time_line with px by time value
      if (time > 1100) { //if time value is greater than 549
        clearInterval(_this.counterLine); //clear counterLine
      }
    }
  }
  showResult() {
    this.info_box.nativeElement.classList.remove("activeInfo"); //hide info box
    this.quiz_box.nativeElement.classList.remove("activeQuiz"); //hide quiz box
    this.result_box.nativeElement.classList.add("activeResult"); //show result box
    // const scoreText = result_box.querySelector(".score_text");
    if (this.userScore > 8) { // if user scored more than 3
      //creating a new span tag and passing the user score number and total question number
      let scoreTag = '<span>and congrats!<br>You got ' + this.userScore + ' Marks</span>';
      this.score_text.nativeElement.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if (this.userScore > 5) { // if user scored more than 1
      let scoreTag = '<span>and nice!<br>You got ' + this.userScore + ' Marks</span>';
      this.score_text.nativeElement.innerHTML = scoreTag;
    }
    else { // if user scored less than 1
      let scoreTag = '<span>and sorry!<br>You got only ' + this.userScore + ' Marks</span>';
      this.score_text.nativeElement.innerHTML = scoreTag;
    }
  }
  complete_quiz() {
    window.location.reload();
  }
  randomQuiz() {
    return Math.floor(Math.random() * this.quizInterface.length);
  }

  getPage(page: number) {
    this.router.navigate(['home', page]);
  }
  onClickPage(event: any) {
    this.Page = event;
    this.getPage(event);
  }

  LogOut() {
    this.authService.logout();
  }
}