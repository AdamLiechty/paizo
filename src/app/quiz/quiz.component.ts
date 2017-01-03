import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable, Subject} from 'rxjs/Rx';
import config from '../config'

import { WebSocketService } from '../web-socket.service'

@Component({
  selector: 'app-quiz',
  template: `
    <div>
      <form *ngIf='gameNotSignedIn()'>
        <h1>{{game.name}}</h1>
        <label for='new-player-name'>Name</label>
        <input [(ngModel)]='newPlayerName' name='new-player-name' />
        <button (click)=joinGame()>Join Game</button>
      </form>
      <div *ngIf='gameSignedIn()'>
        <h1>{{game.name}}</h1>
        <h2>{{player.name}}</h2>
        <button (click)=leaveGame()>Leave game</button>
        <button *ngIf='playerIsMaster()' (click)=nextQuestion()>Next Question</button>
      </div>
    </div>
  `,
  styles: []
})
export class QuizComponent implements OnInit {
  paramsSub: any
  game: any
  player: any = null
  newPlayerName: string
  ws: Subject<any>

  constructor(private activatedRoute: ActivatedRoute, private http: Http, private wss: WebSocketService) { }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      const id = params['id']
      this.http.get(`api/games/${id}`)
        .map(response => response.json())
        .subscribe(
          game => {
            this.game = game
            const playerJSON = localStorage.getItem(`games/${game.id}/player`)
            if (playerJSON) {
              this.player = JSON.parse(playerJSON)
              this.connect()
            }
          },
          error => console.error(`Error: ${error}`)
        )
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  playerIsMaster() { return this.player && this.playerIsMaster }

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
          this.connect()
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

  connect() {
    this.ws = <Subject<any>>this.wss.connect(`${config.wsRoot}/games/${this.game.id}/players/${this.player.id}`)
    this.ws.subscribe(
      msg => {
        console.log(JSON.parse(msg.data))
      },
      null,
      () => console.log('disconnected')
    )

    this.ws.next({authorization: this.player.secret})
  }

  nextQuestion() {
    this.ws.next({type: 'setQuestion', index: (this.game.index || 0) + 1})
  }
}
