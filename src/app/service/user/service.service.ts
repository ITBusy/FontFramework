import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuizInterface } from 'src/app/interface/quiz.interface';
import { SubjectInterface } from 'src/app/interface/subject.interface';
import baseUrl from '../commom';


@Injectable({
  providedIn: 'root'
})
export class Service {

  constructor(private http: HttpClient) { }
  getQuizJson(name: any) {
    return this.http.get<QuizInterface[]>(`${baseUrl}/${name}/`);
  }
  getSubjectJson() {
    return this.http.get<SubjectInterface[]>(`${baseUrl}/Subjects/`);
  }
}
