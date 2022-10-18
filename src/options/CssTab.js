import {EventsManager} from "../SmartShapeConnector.js";
import {Events} from "../events.js";

export default function CssTab(panel) {
    this.panel = panel;
    this.cssEditor = null;

    this.init = () => {
        this.cssEditor = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
            mode: "css",
            theme: "monokai"
        });
        this.setCssEventListeners();
        for (let index in this) {
            if (index !== "panel" && index !== "init") {
                panel[index] = this[index];
            }
        }
    }

    this.setCssEventListeners = () => {
        setTimeout(() => {
            this.cssEditor.on("change", () => {
                this.panel.selectedShape.options.style = this.panel.stringToStyles(this.cssEditor.getValue());
                EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
            })
        },100)
    }
}
