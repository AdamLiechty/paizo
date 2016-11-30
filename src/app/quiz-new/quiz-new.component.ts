import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-quiz-new',
  template: `
    <form>
      <label for="new-quiz-name">Quiz name:</label>
      <input name="new-quiz-name" [(ngModel)]=name />
      <button (click)=createGame() action="submit">Create</button>
    </form>
  `,
  styles: []
})
export class QuizNewComponent implements OnInit {
  name: string;
  constructor(private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  createGame() {
    this.http.post(`/api/games`, {name: this.name, type: 'quiz'})
      .map(res => res.json())
      .forEach(game => this.router.navigate([game.id], { relativeTo: this.route }))
  }
}
