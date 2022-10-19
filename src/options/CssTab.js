import {EventsManager} from "../SmartShapeConnector.js";
import {Events} from "../events.js";
import {stringToStyles} from "../utils/css.js";

export default function CssTab(panel) {
    this.panel = panel;
    this.cssEditor = null;
    this.cssTextArea = null;

    this.init = () => {
        this.cssEditor = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
            mode: "css",
            theme: "monokai"
        });
        this.cssTextArea = document.createElement("textarea");
        this.cssTextArea.id = "cssTextArea";
        this.cssTextArea.style.display = "none";
        document.body.appendChild(this.cssTextArea);
        this.setCssEventListeners();
        for (let index in this) {
            if (index !== "panel" && index !== "init") {
                panel[index] = this[index];
            }
        }
    }

    this.setCssEventListeners = () => {
        setTimeout(() => {
            this.cssEditor.on("change", (_editor,options) => {
                if (options.origin === "setValue") {
                    return
                }
                const text = this.cssEditor.getValue()
                this.panel.selectedShape.options.style = stringToStyles(text);
                this.cssTextArea.value = text;
                this.panel.fillTab.loadFillOptions();
                this.panel.strokeTab.loadStrokeOptions();
                EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
            })
        },100)
    }
}
