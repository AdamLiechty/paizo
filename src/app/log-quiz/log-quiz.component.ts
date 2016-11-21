import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-logquiz',
  template: `
    <div>
      <div *ngIf='gameNotSignedIn()'>
        <h1>{{game.name}}</h1>
        <label for='new-player-name'>Name</label>
        <input [(ngModel)]='newPlayerName' id='new-player-name' />
        <button (click)=joinGame()>Join Game</button>
      </div>
      <div *ngIf='gameSignedIn()'>
        <h1>{{game.name}}</h1>
        <h2>{{player.name}}</h2>
        <button (click)=leaveGame()>Leave game</button>
      </div>
    </div>
  `,
  styles: []
})
export class LogQuizComponent implements OnInit {
  paramsSub: any;
  game: any;
  player: any = null;
  newPlayerName: string;

  constructor(private activatedRoute: ActivatedRoute, private http: Http) { }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      const id = params['id']
      this.http.get(`api/games/${id}`)
        .map(response => response.json())
        .subscribe(
          game => {
            this.game = game
            const playerJSON = localStorage.getItem(`games/${game.id}/player`)
            if (playerJSON) this.player = JSON.parse(playerJSON)
          },
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
  gameSignedIn() {
    return this.game && this.player;
  }

  joinGame() {
    this.http.post(`api/games/${this.game.id}/players`, {name: this.newPlayerName})
      .map(response => response.json())
      .subscribe(
        player => {
          this.player = player
          this.newPlayerName = null
          localStorage.setItem(`games/${this.game.id}/player`, JSON.stringify(player))
        },
        error => console.error(`Error: ${error}`)
      )
  }

  leaveGame() {
    this.http.delete(`api/games/${this.game.id}/players/${this.player.id}`,
        {headers: new Headers({Authorization: this.player.secret})})
      .subscribe(
        () => {
          this.player = null
          localStorage.setItem(`games/${this.game.id}/player`, null)
        },
        error => console.error(`Error: ${error}`)
      )
  }
}
