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

  message: string = '';
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
  }

  onClick(board: number, row: number, col: number) {
    if (this.canPlay == false) return;

    if (this.boards[board][row][col] === '') {
      this.websocket.sendMove([board, row, col]);
      this.canPlay = !this.canPlay;
    }
  }

  registerMoveOnBoard(move: number[]) {
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
    let simulatedBoard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    for (let i = 0; i < this.boards.length; i++) {
      for (let j = 0; j < this.boards[i].length; j++) {
        const row = this.boards[i][j];
        for (let k = 0; k < row.length; k++) {
          const cell = row[k];
          if (cell == this.playerSymbol) {
            simulatedBoard[j][k] = this.playerSymbol;
          }
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        simulatedBoard[i][0] === symbol &&
        simulatedBoard[i][1] === symbol &&
        simulatedBoard[i][2] === symbol
      ) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        simulatedBoard[0][i] === symbol &&
        simulatedBoard[1][i] === symbol &&
        simulatedBoard[2][i] === symbol
      ) {
        return true;
      }
    }

    if (
      simulatedBoard[0][0] === symbol &&
      simulatedBoard[1][1] === symbol &&
      simulatedBoard[2][2] === symbol
    ) {
      return true;
    }
    if (
      simulatedBoard[0][2] === symbol &&
      simulatedBoard[1][1] === symbol &&
      simulatedBoard[2][0] === symbol
    ) {
      return true;
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
  }

  giveUp() {}

  // delete after server implementation
  changePlayerSymbol() {
    this.playerSymbol == 'X'
      ? (this.playerSymbol = 'O')
      : (this.playerSymbol = 'X');
  }

  sendMessage() {
    this.websocket.sendMessage(this.message);
    this.message = '';
  }
}
