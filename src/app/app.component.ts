import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private websocket: WebsocketService) {}

  gameStarted = false;
  firstMove = true;
  canPlay = true;

  message: string = 'test';
  messages: string[] = [];

  playerSymbol = 'X';
  moveCounter = 0;

  board1: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  board2: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  board3: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  boards = [this.board1, this.board2, this.board3];

  ngOnInit() {
    this.websocket.waitForPlayers().subscribe((data) => {
      if (data == 'Game Started!') this.gameStarted = true;
    });
    this.websocket.moveListener().subscribe((move: any) => {
      this.registerMoveOnBoard([move[0], move[1], move[2]]);
    });
    this.websocket.turnListener().subscribe((data) => {
      if (data) this.canPlay = true;
    });
    this.websocket.giveUpListener().subscribe((data) => {
      console.log(data);

      if (data == 'You gave up!') alert('You gave up!');
      else alert('Your opponent gave up!');
    });
  }

  onClick(board: number, row: number, col: number) {
    if (this.canPlay == false) return;

    if (this.boards[board][row][col] === '') {
      this.websocket.sendMove([board, row, col]);
      this.canPlay = !this.canPlay;
    }
  }

  registerMoveOnBoard(move: number[]) {
    console.log(move);

    if (this.boards[move[0]][move[1]][move[2]] === '') {
      this.boards[move[0]][move[1]][move[2]] = this.playerSymbol;
      this.isBoardFull();
      if (this.checkWinner(this.playerSymbol)) {
        alert('Player ' + this.playerSymbol + ' wins!');
        this.resetBoard();
      } else {
        this.changePlayerSymbol();
      }
    }
  }

  checkWinner(symbol: string) {
    // check all boards moves made in a single board
    for (let board = 0; board < this.boards.length; board++) {
      const b = this.boards[board];
      for (let i = 0; i < 3; i++) {
        if (b[i][0] === symbol && b[i][1] === symbol && b[i][2] === symbol) {
          return true;
        }
      }

      for (let i = 0; i < 3; i++) {
        if (b[0][i] === symbol && b[1][i] === symbol && b[2][i] === symbol) {
          return true;
        }
      }

      if (b[0][0] === symbol && b[1][1] === symbol && b[2][2] === symbol) {
        return true;
      }
      if (b[0][2] === symbol && b[1][1] === symbol && b[2][0] === symbol) {
        return true;
      }
    }

    // checking all rows across the 3 boards
    for (let row = 0; row < 3; row++) {
      if (
        (this.boards[0][row][0] == symbol &&
          this.boards[1][row][1] == symbol &&
          this.boards[2][row][2] == symbol) ||
        (this.boards[0][row][2] == symbol &&
          this.boards[1][row][1] == symbol &&
          this.boards[2][row][0] == symbol)
      ) {
        return true;
      }
    }

    // checking all columns across the 3 boards
    for (let column = 0; column < 3; column++) {
      if (
        (this.boards[0][0][column] == symbol &&
          this.boards[1][1][column] == symbol &&
          this.boards[2][2][column] == symbol) ||
        (this.boards[0][2][column] == symbol &&
          this.boards[1][1][column] == symbol &&
          this.boards[2][0][column] == symbol)
      ) {
        return true;
      }
    }

    // checking all diagonals across the 3 boards
    if (
      (this.boards[0][0][0] == symbol &&
        this.boards[1][1][1] == symbol &&
        this.boards[2][2][2] == symbol) ||
      (this.boards[0][2][0] == symbol &&
        this.boards[1][1][1] == symbol &&
        this.boards[2][0][2] == symbol)
    ) {
      return true;
    }
    // checking all same square across the 3 boards
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.boards[0][i][j] == this.playerSymbol &&
          this.boards[1][i][j] == this.playerSymbol &&
          this.boards[2][i][j] == this.playerSymbol
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isBoardFull() {
    this.moveCounter++;
    if (this.moveCounter == 27) alert('Draw!');
  }

  resetBoard() {
    for (let i = 0; i < this.boards.length; i++) {
      for (let j = 0; j < this.boards[i].length; j++) {
        for (let k = 0; k < this.boards[i][j].length; k++) {
          this.boards[i][j][k] = '';
        }
      }
    }
    this.playerSymbol = 'X';
    this.canPlay = true;
    this.moveCounter = 0;
  }

  giveUp() {
    this.websocket.giveUp();
  }

  changePlayerSymbol() {
    this.playerSymbol == 'X'
      ? (this.playerSymbol = 'O')
      : (this.playerSymbol = 'X');
  }

  sendMessage() {
    // this.websocket.sendMessage(this.message);
    this.messages.push(this.message);
    console.log(this.messages);

    this.message = 'test';
  }
}
