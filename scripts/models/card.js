export const CardSuits = {
    HEARTS: 0,
    DIAMONDS: 1,
    CLUBS: 2,
    SPADES: 3
}

export class Card {
    value;
    suit;
    imageName;

    constructor(value, suit, imageName) {
        this.value = value;
        this.suit = suit;
        this.imageName = imageName;
    }

    get cardSlug() {
        return `card-${this.value}-${this.suit}`;
    }

    static initializeCardFromSlug(cardSlug) {
        let parts = cardSlug.split('-');
        if (parts.length !== 3) {
            return null;
        }
        if (parts[0] !== "card") {
            return null;
        }
        let value = parseInt(parts[1]);
        let suit = parseInt(parts[2]);
        // uses assumption of image names but oh well
        let suitName = '';
        switch (suit) {
            case CardSuits.HEARTS:
                suitName = 'hearts';
                break;
            case CardSuits.DIAMONDS:
                suitName = 'diamonds';
                break;
            case CardSuits.SPADES:
                suitName = 'spades';
                break;
            case CardSuits.CLUBS:
                suitName = 'clubs';
                break;
            default:
                return "";
        }
        let imageName = `${suitName}_${value}.png`;
        return new Card(value, suit, imageName);
    }
}