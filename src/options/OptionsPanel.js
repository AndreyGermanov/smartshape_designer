import {EventsManager,ShapeEvents} from "../smart_shape/src/index.js";
import "../plugins/codemirror/codemirror.css";
import "../plugins/codemirror/theme/monokai.css";
import "../plugins/codemirror/codemirror.js";
import "../plugins/codemirror/mode/css.js";
import "../plugins/colorpicker/index.min.js"
import "../plugins/colorpicker/index.css";
import FillTab from "./FillTab.js";
import StrokeTab from "./StrokeTab.js";
import CssTab from "./CssTab.js";
import {Events} from "../events.js";

export default function OptionsPanel() {

    this.options = {};

    this.element = document.querySelector("#optionsPanel");

    this.selectedShape = null;

    this.fillTab = null;
    this.strokeTab = null;

    this.init = () => {
        this.setEventListeners();
        new CssTab(this).init();
        this.fillTab = new FillTab(this).init();
        this.strokeTab = new StrokeTab(this).init();
    }

    this.setEventListeners = () => {
        this.element.querySelectorAll(".nav-link").forEach(item => {
            item.addEventListener("click", (event) => {
                this.element.querySelectorAll(".nav-link").forEach(elem => {
                    elem.classList.remove("active");
                });
                event.target.classList.add("active");
                this.element.querySelectorAll(".tab-pane").forEach(elem => {
                    elem.classList.remove("active");
                });
                this.element.querySelector("#"+event.target.id.replace("_tab","")).classList.add("active");
                this.cssEditor.refresh();

            })
        })
        EventsManager.subscribe([Events.SELECT_SHAPE,ShapeEvents.SHAPE_ACTIVATED], (event) => {
            this.selectedShape = event.target;
            if (this.selectedShape) {
                document.getElementById("optionsCard").style.display = '';
                this.loadOptions();
            }
        });
        EventsManager.subscribe(ShapeEvents.SHAPE_DESTROY, (event) => {
            if (this.selectedShape === event.target) {
                document.getElementById("optionsCard").style.display = 'none';
            }
        })
        this.element.querySelectorAll("#general input").forEach(item => {
            item.addEventListener("keyup",this.applyOption);
            item.addEventListener("change",this.applyOption);
        })
        EventsManager.subscribe([
            ShapeEvents.SHAPE_MOVE,
            ShapeEvents.SHAPE_RESIZE,
            ShapeEvents.SHAPE_ROTATE,
            ShapeEvents.POINT_DRAG_MOVE,
            ShapeEvents.POINT_ADDED,
            ShapeEvents.POINT_DESTROYED
        ],(event) => {
            if (event.target.options.id.search("_clone") === -1 &&
                event.target.points &&
                event.target.options.id.search("_resizebox") === -1 &&
                event.target.options.id.search("_rotatebox") === -1 &&
                event.target.points.length) {
                if (event.target === this.selectedShape) {
                    this.loadOptions();
                }
            }
        });
    }

    this.loadOptions = () => {
        const shape = this.selectedShape;
        this.element.querySelector("#id").setAttribute("value",shape.options.id);
        this.element.querySelector("#name").setAttribute("value",shape.options.name);
        const pos = shape.getPosition(true);
        this.element.querySelector("#width").setAttribute("value",parseInt(pos.width));
        this.element.querySelector("#height").setAttribute("value",parseInt(pos.height));
        this.element.querySelector("#minWidth").setAttribute("value",shape.options.minWidth);
        this.element.querySelector("#minHeight").setAttribute("value",shape.options.minHeight);
        this.element.querySelector("#maxWidth").setAttribute("value",shape.options.maxWidth);
        this.element.querySelector("#maxHeight").setAttribute("value",shape.options.maxHeight);
        this.cssEditor.getDoc().setValue(this.stylesToString(shape.options.style));
        this.fillTab.loadFillOptions();
        this.strokeTab.loadStrokeOptions();
    }

    this.stylesToString = (stylesObj) => {
        const strings = [];
        for (let name in stylesObj) {
            strings.push(name+":"+stylesObj[name]);
        }
        return strings.join("\n")
    }

    this.stringToStyles = (styleString) => {
        const strings = styleString.split("\n");
        const result = {};
        strings.forEach(string => {
            const parts = string.split(":")
            const name = parts.shift();
            result[name] = parts.join(":").replace(";","");
        })
        return result;
    }

    this.applyOption = (event) => {
        const pos = this.selectedShape.getPosition(true);
        switch (event.target.id) {
            case "width":
                const width = parseInt(event.target.value);
                if (!isNaN(width)) {
                    this.selectedShape.scaleTo(width,pos.height);
                }
                break;
            case "height":
                const height = parseInt(event.target.value);
                if (!isNaN(height)) {
                    this.selectedShape.scaleTo(pos.width,height);
                }
                break;
            default:
                const options = {};
                options[event.target.id] = event.target.value;
                this.selectedShape.setOptions(options);
                break;
        }
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.selectedShape);
    }
}