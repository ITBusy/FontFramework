import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountInterface } from '../interface/account.interface';
import { QuizInterface } from '../interface/quiz.interface';
import { SubjectInterface } from '../interface/subject.interface';

@Injectable({
  providedIn: 'root'
})
export class Service {

  constructor(private http : HttpClient) { }

  getQuizJson(name: any){
    return this.http.get<QuizInterface[]>(`http://localhost:3000/${name}/`);
  }
  getSubjectJson(){
    return this.http.get<SubjectInterface[]>(`http://localhost:3000/Subjects/`);
  }
  getAccountJson(name: any){
    return this.http.get<AccountInterface[]>(`http://localhost:3000/${name}/`);
  }
}
