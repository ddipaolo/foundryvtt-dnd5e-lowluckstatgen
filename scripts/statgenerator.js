import { Constants } from "./constants.js";

class StatGenerator {
    constructor() {
        this.cardDeck = [];
        this.piles = [];
    }

    /**
     * Initializes the deck back to the unshuffled, clean, start state.
     */
    async initDeck() {
        this.cardDeck = [ 
            { value: 2, imageName: 'clubs_2.png' },
            { value: 2, imageName: 'diamonds_2.png' },
            { value: 2, imageName: 'spades_2.png' },
            { value: 3, imageName: 'clubs_3.png' },
            { value: 3, imageName: 'diamonds_3.png' },
            { value: 3, imageName: 'spades_3.png' },
            { value: 3, imageName: 'hearts_3.png' },
            { value: 4, imageName: 'clubs_4.png' },
            { value: 4, imageName: 'diamonds_4.png' },
            { value: 4, imageName: 'spades_4.png' },
            { value: 4, imageName: 'hearts_4.png' },
            { value: 5, imageName: 'clubs_5.png' },
            { value: 5, imageName: 'diamonds_5.png' },
            { value: 5, imageName: 'spades_5.png' },
            { value: 5, imageName: 'hearts_5.png' },
            { value: 6, imageName: 'clubs_6.png' },
            { value: 6, imageName: 'diamonds_6.png' },
            { value: 6, imageName: 'spades_6.png' },
        ]
    }

    async initialize() {
        this.initDeck();
        this.piles = [{}, {}, {}, {}, {}, {}];
    }

    getPiles() {
        return this.piles;
    }
    
    drawCardFromDeck() {
        var randIndex = this.cardDeck.length * Math.random() << 0;
        var card = this.cardDeck[randIndex];
        this.cardDeck.splice(randIndex, 1);
        return card;
    }

    dealCardsIntoPiles() {
        this.piles = [];
        for (let pileNum = 1; pileNum <= 6; pileNum++) {
            var pile = [];
            for (let cardNum = 1; cardNum <=3; cardNum++) {
                pile.push(this.drawCardFromDeck());
            }
            this.piles.push(pile);
            // console.log(`lowluckstatgen-dnd5e | pile ${pileNum} = [${pile[0].value}, ${pile[1].value}, ${pile[2].value}]`);
        }
    }
}

export class StatGeneratorApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
    }
    
    getData() {
        let data = {};
        data.piles = this.statGenerator.getPiles();

        return data;
    }

    activateListeners(html) {
        html.find('.deal-piles-button').click( ev => {
            this.statGenerator.dealCardsIntoPiles();
            this.render();
        });

        html.find('.stat-selector').change( ev => this._onStatSelectorChange(ev, html.find('.stat-selector')));
    }

    _onStatSelectorChange(ev, statSelectors) {
        let selectorId = ev.target.id;
        let selectedStat = ev.target.value;
        for (var i = 0; i < statSelectors.length; i++) {
            if (statSelectors[i].id !== selectorId && statSelectors[i].value == selectedStat) {
                statSelectors[i].value = 'Empty';
            }
        }
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;
        const overrides = {
            height: 'auto',
            width: 'auto',
            template: Constants.TEMPLATES.CARD_DRAWER,
            title: 'Low-Luck Stat Generator',
            userId: game.userId
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
        return mergedOptions;
    }

    async _initialize() {
        this.statGenerator = new StatGenerator();
        this.statGenerator.initialize();
        // this.statGenerator.dealCardsIntoPiles();

        Handlebars.registerHelper('sumPile', function (pile) {
            if (pile instanceof Array) {
                return pile.reduce((acc, card) => card.value + acc, 0).toString();
            } else {
                return "n/a";
            }
        });
    }
}