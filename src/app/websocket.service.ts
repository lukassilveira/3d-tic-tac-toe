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
    this.socket.emit('sendMessage', message);
  }

  sendMove(move: number[]) {
    this.socket.emit('moveMessage', move);
  }

  giveUp() {
    this.socket.emit('giveUp');
  }

  moveListener() {
    return this.socket.fromEvent('moveListener');
  }

  turnListener() {
    return this.socket.fromEvent('turnListener');
  }

  messageListener() {
    return this.socket.fromEvent('messageListener');
  }

  giveUpListener() {
    return this.socket.fromEvent('giveUpListener');
  }

  onMessage() {
    return this.socket.fromEvent('chatMessage');
  }
}
