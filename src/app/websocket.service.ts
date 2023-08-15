import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private socket: Socket) {}

  waitForPlayers() {
    return this.socket.fromEvent('gameStarting');
  }

  sendMessage(message: string) {
    this.socket.emit('chatMessage', message);
  }

  sendMove(move: number[]) {
    this.socket.emit('moveMessage', move);
  }

  moveListener() {
    return this.socket.fromEvent('moveListener');
  }

  turnListener() {
    return this.socket.fromEvent('turnListener');
  }

  receiveMessage() {
    return this.socket.fromEvent('receiveMessage');
  }

  onMessage() {
    return this.socket.fromEvent('chatMessage');
  }
}
