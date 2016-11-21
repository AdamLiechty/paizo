import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-log-quiz-new',
  template: `
    <p>
      <label for="new-quiz-name">Quiz name:</label>
      <input id="new-quiz-name" [(ngModel)]=name />
      <button (click)=createGame()>Create</button>
    </p>
  `,
  styles: []
})
export class LogQuizNewComponent implements OnInit {
  name: string;
  constructor(private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  createGame() {
    this.http.post(`/api/games`, {name: this.name, type: 'logQuiz'})
      .map(res => res.json())
      .forEach(game => this.router.navigate([game.id], { relativeTo: this.route }))
  }
}
