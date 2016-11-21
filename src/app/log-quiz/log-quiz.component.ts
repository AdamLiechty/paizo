import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-logquiz',
  template: `
    <div *ngIf='gameNotSignedIn()'>
      <h1>{{game.name}}</h1>
      <label for='new-player-name'>Name</label>
      <input [(ngModel)]='newPlayerName' id='new-player-name' />
      <button>Join Game</button>
    </div>
  `,
  styles: []
})
export class LogQuizComponent implements OnInit {
  paramsSub: any;
  id: string;
  game: any;
  player: any = null;
  newPlayerName: string;

  constructor(private activatedRoute: ActivatedRoute, private http: Http) { }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.http.get(`api/games/${this.id}`)
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

  gameNotSignedIn() {
    return this.game && !this.player;
  }
}
