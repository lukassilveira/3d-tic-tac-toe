import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private socket: Socket) {}

  sendMessage(message: string) {
    this.socket.emit('chatMessage', message);
  }

  onMessage() {
    return this.socket.fromEvent('chatMessage');
  }
}
