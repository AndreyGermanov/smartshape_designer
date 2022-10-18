import Editor from "./Editor.js";
import ShapesPanel from "./ShapesPanel.js";
import OptionsPanel from "./options/OptionsPanel.js";
export default function Studio() {

    this.editor = new Editor();
    this.shapesPanel = new ShapesPanel();
    this.optionsPanel = new OptionsPanel();


    this.init = () => {
        this.editor.init(this);
        this.shapesPanel.init();
        this.optionsPanel.init();
        this.setEventListeners();
        setTimeout(() => {
            this.onWindowResize();
        },100);
    }

    this.setEventListeners = () => {
        window.addEventListener("resize",this.onWindowResize)
    }

    this.onWindowResize = () => {
        const height = window.innerHeight - document.querySelector(".main-header").clientHeight - 40;
        document.querySelector("#editorCard").style.height = (height*0.6)+"px";
        document.querySelector("#optionsCard").style.height = (height*0.4)+"px";
        setTimeout(() => {
            const cardHeader = document.querySelector(".card-header");
            const tabBar = document.querySelector(".nav-tabs")
            document.querySelector(".cm-s-monokai").style.height =
                (height*0.4-cardHeader.clientHeight-tabBar.clientHeight-30)+"px";
        },100);
    }
}
