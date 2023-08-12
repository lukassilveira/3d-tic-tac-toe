import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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

  ngOnInit(): void {
  }

  onClick(board: number, row: number, col: number) {
    // console.log('Board:', board, 'Row:', row, 'Column:', col);

    if (this.boards[board][row][col] === '') {
      this.boards[board][row][col] = this.playerSymbol;
    }
    this.isBoardFull();
    if (this.checkWinner(this.playerSymbol)) {
      alert('Player ' + this.playerSymbol + ' wins!');
      this.resetBoard();
    }
    this.changePlayerSymbol();
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
  }

  giveUp() {}

  // delete after server implementation
  changePlayerSymbol() {
    this.playerSymbol == 'X'
      ? (this.playerSymbol = 'O')
      : (this.playerSymbol = 'X');
  }
}
