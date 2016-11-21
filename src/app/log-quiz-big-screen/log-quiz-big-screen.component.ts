import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-log-quiz-big-screen',
  template: `
  <div *ngIf=game>
    <h1>{{game.name}}</h1>
  </div>
  `,
  styles: []
})
export class LogQuizBigScreenComponent implements OnInit {
  paramsSub: any;
  game: any;

  constructor(private activatedRoute: ActivatedRoute, private http: Http) { }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      const id = params['id']
      this.http.get(`api/games/${id}`)
        .map(response => response.json())
        .subscribe(
          game => this.game = game,
          error => console.error(`Error: ${error}`)
        )
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

}
