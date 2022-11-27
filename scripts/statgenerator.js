import { Pile } from "./models/pile.js";
import { Card, CardSuits } from "./models/card.js";
import { Constants } from "./constants.js";

export class StatGenerator {
    constructor() {
        this.cardDeck = [];
        this.piles = [];
        this.currentMessage = "";
    }

    /**
     * Initializes the deck back to the unshuffled, clean, start state.
     */
    async initDeck() {
        this.cardDeck = [ 
            new Card(2, CardSuits.CLUBS, 'clubs_2.png'),
            new Card(2, CardSuits.DIAMONDS, 'diamonds_2.png'),
            new Card(2, CardSuits.SPADES, 'spades_2.png'),
            new Card(3, CardSuits.CLUBS, 'clubs_3.png'),
            new Card(3, CardSuits.DIAMONDS, 'diamonds_3.png'),
            new Card(3, CardSuits.SPADES, 'spades_3.png'),
            new Card(3, CardSuits.HEARTS, 'hearts_3.png'),
            new Card(4, CardSuits.CLUBS, 'clubs_4.png'),
            new Card(4, CardSuits.DIAMONDS, 'diamonds_4.png'),
            new Card(4, CardSuits.SPADES, 'spades_4.png'),
            new Card(4, CardSuits.HEARTS, 'hearts_4.png'),
            new Card(5, CardSuits.CLUBS, 'clubs_5.png'),
            new Card(5, CardSuits.DIAMONDS, 'diamonds_5.png'),
            new Card(5, CardSuits.SPADES, 'spades_5.png'),
            new Card(5, CardSuits.HEARTS, 'hearts_5.png'),
            new Card(6, CardSuits.CLUBS, 'clubs_6.png'),
            new Card(6, CardSuits.DIAMONDS, 'diamonds_6.png'),
            new Card(6, CardSuits.SPADES, 'spades_6.png'),
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
    }

    /**
     * Given the slugs of two cards, find them in their piles and swap them.
     * 
     * @param {string} cardSlug1  The slug value of the first card to be swapped (can be uniquely mapped back to source card)
     * @param {string} cardSlug2  The slug value of the second card to be swapped (can be uniquely mapped back to source card)
     */
    swapCards(cardSlug1, cardSlug2) {
        let untouchedPiles = [];
        let firstPile = null;
        let secondPile = null;
        for (var pile of this.piles) {
            if (pile.containsCardWithSlug(cardSlug1)) {
                firstPile = pile;
            } else if (pile.containsCardWithSlug(cardSlug2)) {
                secondPile = pile;
            } else {
                untouchedPiles.push(pile);
            }
        }
        firstPile.removeCardWithSlug(cardSlug1);
        firstPile.addCard(Card.initializeCardFromSlug(cardSlug2));

        secondPile.removeCardWithSlug(cardSlug2);
        secondPile.addCard(Card.initializeCardFromSlug(cardSlug1));

        this.piles = untouchedPiles;
        this.piles.push(firstPile);
        this.piles.push(secondPile);

        this.piles.sort((p1, p2) => p1.pileNumber - p2.pileNumber);
    }
}