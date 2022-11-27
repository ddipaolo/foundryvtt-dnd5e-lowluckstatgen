import { PileFlags } from "../constants.js";

export class Pile {
    pileNumber;
    flags;
    cards;

    constructor(pileNumber,  cards) {
        this.pileNumber = pileNumber;
        this.cards = cards;
        this.flags = PileFlags.None;
    }

    get total() {
        return this.cards.reduce((acc, card) => card.value + acc, 0);
    }

    containsCardWithSlug(cardSlug) {
        return this.cards.some(x => x.cardSlug === cardSlug);
    }

    removeCardWithSlug(cardSlug) {
        this.cards = this.cards.filter(x => x.cardSlug !== cardSlug);
    }

    addCard(card) {
        this.cards.push(card);
    }
}
