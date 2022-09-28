import Editor from "./Editor.js";
import ShapesPanel from "./ShapesPanel.js";
import OptionsPanel from "./OptionsPanel.js";
export default function Studio() {

    this.editor = new Editor();
    this.shapesPanel = new ShapesPanel();
    this.optionsPanel = new OptionsPanel();


    this.init = () => {
        this.editor.init();
        this.shapesPanel.init();
    }
};
