import { Constants }  from './constants.js'

export class Settings {
    static SETTINGS = {
        DISPLAY_ON_TITLEBAR: 'display-on-titlebar',
        DISPLAY_INSTRUCTIONS_IN_GENERATOR: 'display-instructions-in-generator',
    }


    static initialize() {
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.DISPLAY_ON_TITLEBAR, {
            name: `LOWLUCKSTATGEN-DND5E.settings.${this.SETTINGS.DISPLAY_ON_TITLEBAR}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `LOWLUCKSTATGEN-DND5E.settings.${this.SETTINGS.DISPLAY_ON_TITLEBAR}.Hint`,
            onChange: () => {},
        });
        game.settings.register(Constants.MODULE_ID, this.SETTINGS.DISPLAY_INSTRUCTIONS_IN_GENERATOR, {
            name: `LOWLUCKSTATGEN-DND5E.settings.${this.SETTINGS.DISPLAY_INSTRUCTIONS_IN_GENERATOR}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `LOWLUCKSTATGEN-DND5E.settings.${this.SETTINGS.DISPLAY_INSTRUCTIONS_IN_GENERATOR}.Hint`,
            onChange: () => {},
        })
    }
}