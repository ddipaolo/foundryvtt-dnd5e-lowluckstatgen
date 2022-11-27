import { Pile } from '../models/pile.js'
import { StatGenerator } from '../statgenerator.js'
import { Constants, ButtonFlags, PileFlags } from '../constants.js';

const StatGeneratorStates = {
    UNKNOWN: 0,
    INITIALIZED: 1,
    PILES_DEALT: 2,
    SWAPPING_CARDS_START: 3,
    SWAPPING_CARDS_MIDDLE: 4,
    CARDS_SWAPPED: 5
}

export class StatGeneratorApp extends FormApplication {
    constructor() {
        super();
        this._initialize();
        this.state = StatGeneratorStates.UNKNOWN;
    }
    
    getData() {
        let data = {};
        data.message = this.currentMessage;
        data.piles = this.statGenerator.getPiles();
        data.buttonStates = this.buttonStates;
        data.state = this.state;
        return data;
    }

    setActor(actorId) {
        this.actorId = actorId;
    }

    activateListeners(html) {
        html.find('.deal-piles-button').click( ev => this._dealPilesAndUpdate(html));
        html.find('.swap-card-button').click( ev => this._startCardSwap(html));
        html.find('.apply-stats-button').click( ev => this._applyStatsAndClose(html.find('.stat-selector'), html.find('.pile-list')));

        html.find('.card-image').click(ev => this._handleCardClick(ev, html));

        html.find('.stat-selector').change( ev => this._onStatSelectorChange(ev, html.find('.stat-selector')));
    }

    _dealPilesAndUpdate(html) {
        if (this.buttonStates['deal-piles-button'] === ButtonFlags.Enabled) {
            this.statGenerator.dealCardsIntoPiles();
            this._tagHighLowPiles(html);
            this.currentMessage = game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.messages.cards-dealt');
            this.buttonStates['swap-card-button'] = ButtonFlags.Enabled;
            this.buttonStates['apply-stats-button'] = ButtonFlags.Enabled;
            this.state = StatGeneratorStates.PILES_DEALT;
            this.render();
        }
    }

    _handleCardClick(ev, html) {
        if (this.reactToCardClicks) {
            if (this.state === StatGeneratorStates.SWAPPING_CARDS_START) {  // we haven't picked a second card yet, this is the first, the low card
                // validate it's from a low pile
                if (ev.currentTarget.closest('.pile').classList.contains('low-pile')) {
                    ev.currentTarget.classList.add('selected-card-image');
                    this.currentMessage = game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.messages.swap-middle');
                    this.firstCardToSwap = ev.currentTarget.id;
                    this.statGenerator.activateHighPiles();
                    this.state = StatGeneratorStates.SWAPPING_CARDS_MIDDLE;
                    this.render();
                } else {
                    ui.notifications.warn(game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.notifications.invalid-first-card'));
                }
            } else if (this.state === StatGeneratorStates.SWAPPING_CARDS_MIDDLE) {
                // validate it's from a high pile
                if (ev.currentTarget.closest('.pile').classList.contains('high-pile')) {
                    this.currentMessage = game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.messages.swap-complete');
                    this.statGenerator.swapCards(this.firstCardToSwap, ev.currentTarget.id);
                    this.state = StatGeneratorStates.CARDS_SWAPPED;
                    this.buttonStates['deal-piles-button'] = ButtonFlags.Enabled;
                    this.buttonStates['apply-stats-button'] = ButtonFlags.Enabled;
                    this.statGenerator.deactivateAllPiles();
                    this.render();
                } else {
                    ui.notifications.warn(game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.notifications.invalid-second-card'));
                }
            }
        }
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

    _startCardSwap(html) {
        if (this.buttonStates['swap-card-button'] === ButtonFlags.Enabled) {
            this.currentMessage = game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.messages.swap-start');
            this.buttonStates['deal-piles-button'] = ButtonFlags.Disabled;
            this.buttonStates['swap-card-button'] = ButtonFlags.Disabled;
            this.buttonStates['apply-stats-button'] = ButtonFlags.Disabled;
            this.reactToCardClicks = true;
            this.statGenerator.activateLowPiles();
            this.state = StatGeneratorStates.SWAPPING_CARDS_START;
            this.render();
        }
    }


    _applyStatsAndClose(statSelectors, piles) {
        if (this.buttonStates['apply-stats-button'] === ButtonFlags.Enabled) {
            let accruedStats = {};
            // NB: this assumes that the jquery selector will do things in order, which it may not - this should be refactored
            // to include the stat selector along with the pile in a control of some sort.  It also depends upon the rendered
            // HTML having an element with that ID and its contents being exclusively just the total as an integer.
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
                        if (stat === "Empty") {
                            ui.notifications.error(game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.notifications.select-ability-scores-before-applying'));
                            return;
                        }
                        updateData[`system.abilities.${stat}.value`] = accruedStats[stat];
                    }
                    actor.update(updateData);
                }
                this.close();
            } else {
                ui.notifications.error(game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.notifications.select-ability-scores-before-applying'));
            }
        }
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

        this.reactToCardClicks = false;
        this.currentMessage = game.i18n.localize('LOWLUCKSTATGEN-DND5E.ui.messages.startup');

        this.buttonStates = {
            'deal-piles-button': ButtonFlags.Enabled,
            'swap-card-button': ButtonFlags.Disabled,
            'apply-stats-button': ButtonFlags.Disabled,
        };
        this.statGenerator = new StatGenerator();
        this.statGenerator.initialize();
        this.state = StatGeneratorStates.INITIALIZED;

        Handlebars.registerHelper('renderFlags', function(pileFlags) {
            let flags = []
            if (pileFlags & PileFlags.LowPile) {
                flags.push("low-pile");
            }
            if (pileFlags & PileFlags.HighPile) {
                flags.push("high-pile");
            }
            if (pileFlags & PileFlags.ActivePile) {
                flags.push("active-pile");
            }
            return flags.join(' ');
        });

        Handlebars.registerHelper('isEnabled', function(btnName) {
            if (btnName in this.buttonStates) {
                if (this.buttonStates[btnName] === ButtonFlags.Enabled) {
                    return "enabled";
                } else if (this.buttonStates[btnName] === ButtonFlags.Disabled) {
                    return "disabled";
                } else {
                    return "";
                }
            } else {
                return "";
            }
        });
    }
}