import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { RpcService } from './rpc.service';
import { mergeMap, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    // private websocket: WebsocketService,
    private rpc: RpcService
  ) {}

  gameStarted = false;
  firstMove = true;
  canPlay = true;
  gameStatus = '';
  playerId = '';
  playerThatPlayed = '';

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

  reloadInterval = 500;

  ngOnInit() {
    // setando player id
    this.rpc.connect().subscribe((data: string) => {
      this.playerId = data.split('<string>')[1].split('</string>')[0];
    });

    // RPC OK!
    // this.websocket.waitForPlayers().subscribe((data) => {
    //   if (data == 'Game Started!') {
    //     this.gameStarted = true;
    //     this.gameStatus = 'Both players have connected! Any player can begin!';
    //   }
    //  });

    // esperando segundo player
    timer(0, this.reloadInterval)
      .pipe(mergeMap((_) => this.rpc.gameStartStatus()))
      .subscribe((data: any) => {
        if (data.includes('Game Started!')) {
          this.gameStarted = true;
          if (this.firstMove) {
            this.gameStatus =
              'Both players have connected! Any player can begin!';
          }
        }
      });

    // this.websocket.moveListener().subscribe((move: any) => {
    //   this.registerMoveOnBoard([move[0], move[1], move[2]]);
    // });

    // registrando nova jogada
    timer(0, this.reloadInterval)
      .pipe(mergeMap((_) => this.rpc.getLastMove()))
      .subscribe((data: string) => {
        if (data.includes('int')) {
          this.registerMoveOnBoard([
            parseInt(data.split('<int>')[1].charAt(0)),
            parseInt(data.split('<int>')[2].charAt(0)),
            parseInt(data.split('<int>')[3].charAt(0)),
          ]);
        } else {
          this.resetBoard();
        }
      });

    // this.websocket.turnListener().subscribe((data) => {
    //   if (data) {
    //     this.canPlay = true;
    //     this.gameStatus = 'Your turn!';
    //   }
    // });

    // gerenciador de desistencia
    timer(0, this.reloadInterval)
      .pipe(mergeMap((_) => this.rpc.giveUpListener()))
      .subscribe((data: string) => {
        if (data.includes('Player 1 gave up!')) {
          alert('Player 1 gave up!');
        } else if (data.includes('Player 2 gave up!')) {
          alert('Player 2 gave up!');
        }
      });

    timer(0, this.reloadInterval)
      .pipe(mergeMap((_) => this.rpc.getMessages()))
      .subscribe((data: string) => {
        var messages = data.split("<string>")
        var messageArray = []
        for (let index = 1; index < messages.length; index++) {
          const element = messages[index].split("</string>")[0];
          messageArray.push(element);
        }
        if (messageArray === messages) return;
        console.log(messageArray);
        this.messages = messageArray;
      });

    // this.websocket.messageListener().subscribe((data: any) => {
    //   this.messages.push(data);
    // });

    // gerenciador de turno
    timer(0, this.reloadInterval)
      .pipe(mergeMap((_) => this.rpc.turnListener()))
      .subscribe((data: string) => {
        this.playerThatPlayed = data.split('<string>')[1].split('</string>')[0];
      });

    // this.websocket.giveUpListener().subscribe((data) => {
    //   if (data == 'You gave up!') alert('You gave up!');
    //   else alert('Your opponent gave up!');
    //   this.resetBoard();
    // });
  }

  onClick(board: number, row: number, col: number) {
    // if (this.canPlay == false) return;
    if (this.playerThatPlayed == this.playerId) return;
    if (this.boards[board][row][col] === '') {
      // this.websocket.sendMove([board, row, col]);
      this.rpc.move(board, row, col, this.playerId).subscribe();
      this.gameStatus = 'You have played, wait your turn!';
      // this.canPlay = !this.canPlay;
    }
  }

  registerMoveOnBoard(move: number[]) {
    if (this.boards[move[0]][move[1]][move[2]] === '') {
      this.boards[move[0]][move[1]][move[2]] = this.playerSymbol;
      this.isBoardFull();
      if (this.checkWinner(this.playerSymbol)) {
        this.rpc.resetGame().subscribe();
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
    // this.canPlay = true;
    this.playerThatPlayed = '';
    this.moveCounter = 0;
    this.gameStatus = 'The game restarted! Any player can begin!';
  }

  giveUp() {
    // this.websocket.giveUp();
    this.rpc.giveUp(this.playerId).subscribe(() => {
      this.rpc.resetGame().subscribe();
      this.rpc.sendMessage(`${this.playerId} gave up!`).subscribe();
    });
  }

  changePlayerSymbol() {
    this.playerSymbol == 'X'
      ? (this.playerSymbol = 'O')
      : (this.playerSymbol = 'X');
  }

  sendMessage() {
    // this.websocket.sendMessage(this.message);    
    this.rpc.sendMessage(`${this.playerId}: ` + this.message).subscribe();
    this.message = '';
  }
}
