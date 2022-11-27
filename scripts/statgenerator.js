import { Pile } from "./models/pile.js";
import { Card } from "./models/card.js";

export class StatGenerator {
    constructor() {
        this.cardDeck = [];
        this.piles = [];
    }

    /**
     * Initializes the deck back to the unshuffled, clean, start state.
     */
    async initDeck() {
        this.cardDeck = [ 
            new Card(2, 'clubs_2.png'),
            new Card(2, 'clubs_2.png'),
            new Card(2, 'diamonds_2.png'),
            new Card(2, 'spades_2.png'),
            new Card(3, 'clubs_3.png'),
            new Card(3, 'diamonds_3.png'),
            new Card(3, 'spades_3.png'),
            new Card(3, 'hearts_3.png'),
            new Card(4, 'clubs_4.png'),
            new Card(4, 'diamonds_4.png'),
            new Card(4, 'spades_4.png'),
            new Card(4, 'hearts_4.png'),
            new Card(5, 'clubs_5.png'),
            new Card(5, 'diamonds_5.png'),
            new Card(5, 'spades_5.png'),
            new Card(5, 'hearts_5.png'),
            new Card(6, 'clubs_6.png'),
            new Card(6, 'diamonds_6.png'),
            new Card(6, 'spades_6.png'),
        ]
    }

    async initialize() {
        this.initDeck();
    }

    getPiles() {
        return this.piles;
    }

    updatePile(pileNum, pile) {
        for (let i=0; i < this.piles.length; i++) {
            if (this.piles[i].pileNumber === pileNum) {
                this.piles[i] = pile;
            }
        }
    }

    updatePile(pileNum, fn) {
        for (let i=0; i < this.piles.length; i++) {
            if (this.piles[i].pileNumber === pileNum) {
                fn(this.piles[i]);
            }
        }
    }
    
    drawCardFromDeck() {
        var randIndex = this.cardDeck.length * Math.random() << 0;
        var card = this.cardDeck[randIndex];
        this.cardDeck.splice(randIndex, 1);
        return card;
    }

    dealCardsIntoPiles() {
        this.piles = [];
        for (let pileNum = 0; pileNum < 6; pileNum++) {
            var pileCards = [];
            for (let cardNum = 1; cardNum <=3; cardNum++) {
                pileCards.push(this.drawCardFromDeck());
            }
            this.piles.push(new Pile(pileNum+1, pileCards));
        }
        return this.piles;
    }
}