enum MatchCondition {
  Suits,
  Values,
  SuitAndValue,
}

enum Suits {
  Clubs = "Clubs", // ♣️
  Diamonds = "Diamonds", //♦️
  Hearts = "Hearts", // ♥️
  Spades = "Spades", //♠️
}

enum Values {
  Two = "Two",
  Three = "Three",
  Four = "Four",
  Five = "Five",
  Six = "Six",
  Seven = "Seven",
  Eight = "Eight",
  Nine = "Nine",
  Ten = "Ten",
  Jack = "Jack",
  Queen = "Queen",
  King = "King",
  Ace = "Ace",
}

interface Card {
  value: Values;
  suit: Suits;
}

function generatePack(): Array<Card> {
  let pack: Array<Card> = [];
  for (let i of Object.keys(Values)) {
    for (let j of Object.keys(Suits)) {
      pack.push({ value: Values[i], suit: Suits[j] });
    }
  }
  return pack;
}

const pack: Array<Card> = generatePack();

class Deck {
  cards: Array<Card> = [];

  constructor(numberOfPacks: number) {
    this.generate(numberOfPacks);
    this.shuffle();
  }

  generate(numberOfPacks: number): void {
    for (let i = 0; i < numberOfPacks; i++) {
      this.cards.push(...pack);
    }
  }

  shuffle(): void {
    let m = this.cards.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [this.cards[m], this.cards[i]] = [this.cards[i], this.cards[m]];
    }
  }
}

interface Player {
  name: string;
  score: number;
}

class Players {
  private players: Array<Player> = [];

  whoSaidMatchFirst(): string {
    const names = this.players.map((p) => p.name);
    const i = Math.floor(Math.random() * names.length);
    return names[i];
  }

  whoWon(): string {
    if (this.players.length == 1) {
      return this.players[0].name;
    }

    this.players.sort((a, b) =>
      a.score > b.score ? -1 : a.score < b.score ? 1 : 0
    );

    let isDraw = this.players[0].score == this.players[1].score;

    return isDraw ? "draw" : this.players[0].name;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  addScore(whom: string, score: number): void {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name == whom) {
        this.players[i].score += score;
      }
    }
  }
}

class MatchGame {
  matchCondition: MatchCondition;
  players: Players;
  pile: Array<Card>;
  deck: Deck;

  constructor(matchCondition: MatchCondition, players: Players, deck: Deck) {
    this.matchCondition = matchCondition;
    this.players = players;
    this.deck = deck;
    this.pile = [];
  }

  isMatch(): boolean {
    if (this.pile.length < 2) {
      return false;
    }

    // consider using fabric here
    switch (this.matchCondition) {
      case MatchCondition.Suits: {
        return this.pile[0].suit == this.pile[1].suit;
      }
      case MatchCondition.Values: {
        return this.pile[0].value == this.pile[1].value;
      }
      case MatchCondition.SuitAndValue: {
        return (
          this.pile[0].suit == this.pile[1].suit &&
          this.pile[0].value == this.pile[1].value
        );
      }
    }
  }

  nextTurn(): void {
    this.pile.unshift(this.deck.cards.shift()!);
  }

  isFinished(): boolean {
    return this.deck.cards.length == 0;
  }

  play(): string {
    while (!this.isFinished()) {
      this.nextTurn();

      if (this.isMatch()) {
        let player = this.players.whoSaidMatchFirst();
        this.players.addScore(player, this.pile.length);
        this.pile = [];
      }
    }

    return this.players.whoWon();
  }
}

/* 
Notes:
- Add unit tests for each function
- "whoSaidMatchFirst" should wait for a player (at least one) to say match. Consider async methods in Player
- Use something for inputs (console input or simple HTML forms)
- Visualise game
*/

let numOfPacks = 3;
let deck = new Deck(numOfPacks);
let matchCondition = MatchCondition.Suits;

let players = new Players();
players.addPlayer({ name: "Bob", score: 0 });
players.addPlayer({ name: "Alice", score: 0 });

let game = new MatchGame(matchCondition, players, deck);
let winner = game.play();

console.log(
  `Deck of ${numOfPacks} packs, match condition is ${MatchCondition[matchCondition]}`
);
console.log(`Winner is ${winner}`);
