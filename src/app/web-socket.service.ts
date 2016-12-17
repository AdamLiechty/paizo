import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject'
import { Injectable } from '@angular/core'

@Injectable()
export class WebSocketService {

  constructor() { }

  private socket: Subject<MessageEvent>
  public connect(url: string): Subject<MessageEvent> {
    if(!this.socket) {
      this.socket = this.create(url)
    }
    return this.socket
  }

  private create(url: string): Subject<MessageEvent> {


    let ws = new WebSocket(url);
    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs)
        ws.onerror = obs.error.bind(obs)
        ws.onclose = obs.complete.bind(obs)
        return ws.close.bind(ws)
      }
    )
    let queuedMessages = []
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data))
        } else {
          // Web socket isn't quite ready. Queue the message and wait.
          if (!queuedMessages.length) {
            const interval = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                clearInterval(interval)
                queuedMessages.forEach(m => ws.send(m))
              }
            }, 100)
          }
          queuedMessages.push(JSON.stringify(data))
        }
      }
    }

    return Subject.create(observer, observable)
  }
}
