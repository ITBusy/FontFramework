import { Component, ElementRef, OnInit } from '@angular/core';
import { QuizInterface } from '../interface/quiz.interface';
import { SubjectInterface } from '../interface/subject.interface';
import { Service } from '../service/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private ele: ElementRef,
    private service: Service
  ) { }

  ngOnInit(): void {
    this.scripts();
    this.getSubject();
    this.totalPages = this.subjectInterface.length;
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

  totalPages: any;
  Page = 1;






  getQuiz() {
    this.service.getQuizJson(this.subb)
      .subscribe(res => {
        this.quizInterface = res;
      });
  }
  s() { }
  scripts() {
    const modal = this.ele.nativeElement.querySelector('.modal-quiz');
    const info_box = this.ele.nativeElement.querySelector(".info_box");
    const exit_btn = info_box.querySelector(".buttons .quit");
    const continue_btn = info_box.querySelector(".buttons .restart");
    const quiz_box = this.ele.nativeElement.querySelector(".quiz_box");
    const subject = this.ele.nativeElement.querySelector('.subject__title');


    // if exitQuiz button clicked
    exit_btn.onclick = () => {
      info_box.classList.remove("activeInfo"); //hide info box
      modal.style.display = "none";
    }

    // if continueQuiz button clicked
    continue_btn.onclick = () => {
      info_box.classList.remove("activeInfo"); //hide info box
      quiz_box.classList.add("activeQuiz"); //show quiz box
      subject.innerText = this.subjectName;
      this.startTimer(30); //calling startTimer function
      this.startTimerLine(0); //calling startTimerLine function
    }


    // if restartQuiz button clicked
    // restart_quiz.onclick = ()=>{
    //     quiz_box.classList.add("activeQuiz"); //show quiz box
    //     result_box.classList.remove("activeResult"); //hide result box
    //     timeValue = 15; 
    //     que_count = 0;
    //     que_numb = 1;
    //     userScore = 0;
    //     widthValue = 0;
    //     showQuetions(que_count); //calling showQestions function
    //     queCounter(que_numb); //passing que_numb value to queCounter
    //     clearInterval(counter); //clear counter
    //     clearInterval(counterLine); //clear counterLine
    //     startTimer(timeValue); //calling startTimer function
    //     startTimerLine(widthValue); //calling startTimerLine function
    //     timeText.textContent = "Time Left"; //change the text of timeText to Time Left
    //     next_btn.classList.remove("show"); //hide the next button
    // }
  }

  getSubject() {
    const ul = this.ele.nativeElement.querySelector('ul.list-group');
    this.service.getSubjectJson().subscribe(res => {
      this.subjectInterface = res;
    });
    this.subjectInterface.forEach(e => {
      ul.insertAdjacentHTML("afterend",
        `<li class="list-group-item" sub="${e.Id}">${e.Name}</li>`)
    });
    const ite = this.ele.nativeElement.querySelectorAll('.list-group-item');
    const modal = this.ele.nativeElement.querySelector('.modal-quiz');
    const info_box = this.ele.nativeElement.querySelector(".info_box");

    ite.forEach((item: any) => {
      item.onclick = () => {
        ite.forEach((e: any) => {
          if (e.classList.contains('modal-active')) {
            e.classList.remove('modal-active');
          }
        });
        item.classList.add('modal-active');
        modal.style.display = "flex";
        info_box.classList.add("activeInfo");
        this.subb = item.getAttribute('sub');
        this.getQuiz();
        this.subjectName = item.innerHTML;
      }
    });
  }

  nextQuiz() {
    const next_btn = this.ele.nativeElement.querySelector("footer .next_btn");
    if (this.currentIndex < 9) {
      this.currentIndex++;
      this.posCurQui = this.randomQuiz();
      next_btn.classList.remove('show');
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
    const option_list = this.ele.nativeElement.querySelector('.option_list');
    const next_btn = this.ele.nativeElement.querySelector("footer .next_btn");
    let tag;
    let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
    let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
    let correctAnswer = this.quizInterface[this.posCurQui].AnswerId; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items

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
        if (option_list.children[i].children[0].getAttribute('answeri') == correctAnswer) { //if there is an option which is matched to an array answer 
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        }
      }
    }
    for (let i = 0; i < allOptions; i++) {
      option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
  }
  startTimer(time: number) {
    const option_list = this.ele.nativeElement.querySelector('.option_list');
    const timeText = this.ele.nativeElement.querySelector(".timer .time_left_txt");
    const timeCount = this.ele.nativeElement.querySelector(".timer .timer_sec");
    this.counter = setInterval(() => {
      timeCount.textContent = time; //changing the value of timeCount with time value
      time--; //decrement the time value
      if (time < 9) { //if timer is less than 9
        let addZero = timeCount.textContent;
        timeCount.textContent = "0" + addZero; //add a 0 before time value
      }
      if (time < 0) { //if timer is less than 0
        clearInterval(this.counter); //clear counter
        timeText.textContent = "Time Off"; //change the time text to time off
        const next_btn = this.ele.nativeElement.querySelector("footer .next_btn");
        let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
        let correctAnswer = this.quizInterface[this.posCurQui].AnswerId; //getting correct answer from array
        const allOptions = option_list.children.length; //getting all option items

        for (let i = 0; i < allOptions; i++) {
          if (option_list.children[i].children[0].getAttribute('answeri') == correctAnswer) { //if there is an option which is matched to an array answer 
            option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
            option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          }
        }
        for (let i = 0; i < allOptions; i++) {
          option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
        }
        next_btn.classList.add("show"); //show the next button if user selected any option
      }
    }, 1000);
  }
  startTimerLine(time: number) {
    const time_line = this.ele.nativeElement.querySelector("header .time_line");
    this.counterLine = setInterval(timer, 29);
    const _this = this;
    function timer() {
      time += 1; //upgrading time value with 1
      time_line.style.width = time + "px"; //increasing width of time_line with px by time value
      if (time > 1100) { //if time value is greater than 549
        clearInterval(_this.counterLine); //clear counterLine
      }
    }
  }
  showResult() {
    const info_box = this.ele.nativeElement.querySelector(".info_box");
    const quiz_box = this.ele.nativeElement.querySelector(".quiz_box");
    const result_box = this.ele.nativeElement.querySelector(".result_box");

    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    if (this.userScore > 8) { // if user scored more than 3
      //creating a new span tag and passing the user score number and total question number
      let scoreTag = '<span>and congrats!<br>You got ' + this.userScore + ' Marks</span>';
      scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    }
    else if (this.userScore > 5) { // if user scored more than 1
      let scoreTag = '<span>and nice!<br>You got ' + this.userScore + ' Marks</span>';
      scoreText.innerHTML = scoreTag;
    }
    else { // if user scored less than 1
      let scoreTag = '<span>and sorry!<br>You got only ' + this.userScore + ' Marks</span>';
      scoreText.innerHTML = scoreTag;
    }
  }
  complete_quiz() {
    window.location.reload();
  }
  randomQuiz() {
    return Math.floor(Math.random() * this.quizInterface.length);
  }
}