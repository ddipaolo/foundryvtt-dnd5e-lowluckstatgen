export class Constants {
    static MODULE_ID = 'lowluckstatgen-dnd5e';
    static ACTOR_DEFAULT_OWNER_KEY = 'default';
    static MINIMUM_OWNERSHIP_VALUE = 3; // 0 = None, 1 = Limited, 2 = Observer, 3 = Owner
    static TEMPLATES = {
        CARD_DRAWER: `modules/${this.MODULE_ID}/templates/card-drawer.hbs`,
        PILE_PARTIAL: `modules/${this.MODULE_ID}/templates/pile.hbs`,
        CARD_PARTIAL: `modules/${this.MODULE_ID}/templates/card.hbs`
    }
    static PILE_TOTAL_MIN = 6;
    static PILE_TOTAL_MAX = 18;
}

export class ButtonFlags  {
    static Disabled = 0;
    static Enabled = 1;
}

export class PileFlags {
    static None = 0;
    static LowPile = 1;
    static HighPile = 2;
    static ActivePile = 4;
}
