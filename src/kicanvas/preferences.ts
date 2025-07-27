/*
    Copyright (c) 2023 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { LocalStorage } from "../base/local-storage";
import type { Theme } from "../kicad";
import themes from "./themes";

export class Preferences extends EventTarget {
    public static readonly INSTANCE = new Preferences();

    private storage = new LocalStorage("kc:prefs");

    public theme: Theme = themes.default;
    public alignControlsWithKiCad: boolean = true;

    public save() {
        this.storage.set("theme", this.theme.name);
        this.storage.set("alignControlsWithKiCad", this.alignControlsWithKiCad);
        this.dispatchEvent(new PreferencesChangeEvent({ preferences: this }));
    }

    public load() {
        this.theme = themes.by_name(
            this.storage.get("theme", themes.default.name),
        );
        this.alignControlsWithKiCad = this.storage.get(
            "alignControlsWithKiCad",
            false,
        );
    }
}

Preferences.INSTANCE.load();

export type PreferencesChangeEventDetails = {
    preferences: Preferences;
};

export class PreferencesChangeEvent extends CustomEvent<PreferencesChangeEventDetails> {
    static readonly type = "kicanvas:preferences:change";

    constructor(detail: PreferencesChangeEventDetails) {
        super(PreferencesChangeEvent.type, {
            detail: detail,
            composed: true,
            bubbles: true,
        });
    }
}
