import { Constants }  from './constants.js'

export class Settings {
    static SETTINGS = {
        DISPLAY_ON_TITLEBAR: 'display-on-titlebar'
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
        })
    }
}