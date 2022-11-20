export class Constants {
    static MODULE_ID = 'lowluckstatgen-dnd5e';
    static ACTOR_DEFAULT_OWNER_KEY = 'default';
    static MINIMUM_OWNERSHIP_VALUE = 3; // 0 = None, 1 = Limited, 2 = Observer, 3 = Owner
    static TEMPLATES = {
        CARD_DRAWER: `modules/${this.MODULE_ID}/templates/card-drawer.hbs`
    }
}