import { Pile } from '../models/pile.js'
import { StatGenerator } from '../statgenerator.js'
import { Constants, ButtonFlags, PileFlags } from '../constants.js';

export class StatGeneratorApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
    }
    
    getData() {
        let data = {};
        data.piles = this.statGenerator.getPiles();
        data.buttonStates = this.buttonStates;
        return data;
    }

    setActor(actorId) {
        this.actorId = actorId;
    }

    activateListeners(html) {
        html.find('.deal-piles-button').click( ev => {
            var piles = this.statGenerator.dealCardsIntoPiles();
            this.buttonStates['deal-piles-button'] = ButtonFlags.Disabled;
            this._tagHighLowPiles(html);
            this.buttonStates['clear-piles-button'] = ButtonFlags.Enabled;
            this.buttonStates['swap-card-button'] = ButtonFlags.Enabled;
            this.render();
        });

        html.find('.apply-stats-button').click( ev => this._applyStatsAndClose(html.find('.stat-selector'), html.find('.pile-list')));

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

    _applyStatsAndClose(statSelectors, piles) {
        let accruedStats = {};
        for (var i=0; i < statSelectors.length; i++) {
            accruedStats[statSelectors[i].value] = parseInt(piles.find(`#pile-${i+1}-total`)[0].innerHTML);
        }
        if (Object.keys(accruedStats).length === 6) {
            let actor = game.actors.get(this.actorId);
            if (actor === null) {
                ui.notifications.warn('Unable to find appropriate actor');
            } else {
                let updateData = {};
                for (let stat in accruedStats) {
                    updateData[`system.abilities.${stat}.value`] = accruedStats[stat];
                }
                actor.update(updateData);
            }
        }
        this.close();
    }

    _tagHighLowPiles(html) {
        let highPileNums = [];
        let lowPileNums = [];
        let highTotal = Constants.PILE_TOTAL_MIN;  // lowest possible total
        let lowTotal = Constants.PILE_TOTAL_MAX;  // highest possible total
        for (var pile of this.statGenerator.getPiles()) {
            let pileTotal = pile.total;
            if (pileTotal > highTotal) {
                highPileNums = [pile.pileNumber];
                highTotal = pileTotal;
            } else if (pileTotal === highTotal) {
                highPileNums.push(pile.pileNumber);
                highTotal = pileTotal;
            } 
            if (pileTotal === lowTotal) {
                lowPileNums.push(pile.pileNumber);
                lowTotal = pileTotal;
            } else if (pileTotal < lowTotal) {
                lowPileNums = [pile.pileNumber];
                lowTotal = pileTotal;
            }
        }
        for (var highPileNum of highPileNums) {
            this.statGenerator.updatePile(highPileNum, x => x.flags = PileFlags.HighPile);
        }
        for (var lowPileNum of lowPileNums) {
            this.statGenerator.updatePile(lowPileNum, x => x.flags = PileFlags.LowPile);
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
        loadTemplates({
            pile: Constants.TEMPLATES.PILE_PARTIAL,
            card: Constants.TEMPLATES.CARD_PARTIAL,
        });

        this.buttonStates = {
            'deal-piles-button': ButtonFlags.Enabled,
            'clear-piles-button': ButtonFlags.Disabled,
            'swap-card-button': ButtonFlags.Disabled,
            'apply-stats-button': ButtonFlags.Disabled,
        };
        this.statGenerator = new StatGenerator();
        this.statGenerator.initialize();
        // this.statGenerator.dealCardsIntoPiles();

        Handlebars.registerHelper('sumPile', function (pile) {
            if (pile instanceof Pile) {
                return pile.cards.reduce((acc, card) => card.value + acc, 0).toString();
            } else {
                return "n/a";
            }
        });

        Handlebars.registerHelper('renderFlags', function(pile) {
            if (pile instanceof Pile) {
                if (pile.flags === PileFlags.HighPile) {
                    return "high-pile";
                } else if (pile.flags === PileFlags.LowPile) {
                    return "low-pile";
                } else {
                    return "";
                }
            } else {
                return "";
            }
        });
    }
}