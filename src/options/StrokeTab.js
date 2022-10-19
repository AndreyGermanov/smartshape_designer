import {getColorBrightness, hex2rgba, isColorSymbol, rgba2hex, setColorInput} from "../utils/color.js";
import {EventsManager} from "../SmartShapeConnector.js";
import {Events} from "../events.js";
import {stylesToString} from "../utils/css.js";

export default function StrokeTab (panel) {
    this.panel = panel

    this.strokeColor = this.panel.element.querySelector("#strokeColor");
    this.strokeColorPicker = CP(this.strokeColor);
    this.strokeWidth = this.panel.element.querySelector("#strokeWidth");
    this.strokeLinecap = this.panel.element.querySelector("#strokeLinecap");
    this.strokeDasharray = this.panel.element.querySelector("#strokeDasharray");

    this.init = () => {
        this.strokeColorPicker.noAlpha = true;
        this.strokeColorPicker.self.classList.add(this.strokeColorPicker.state.class + '__dialog--no-alpha');
        this.setFillEventListeners();
        return this;
    }

    this.setFillEventListeners = () => {
        this.strokeColorPicker.on('change', this.onStrokeColorPickerChange);
        this.strokeLinecap.addEventListener('change',this.onStrokeLinecapChange);
        this.strokeWidth.addEventListener('change', this.onStrokeWidthChange);
        this.strokeWidth.addEventListener('keyup', this.onStrokeWidthChange);
        this.strokeColor.addEventListener('change', this.onStrokeColorChange);
        this.strokeColor.addEventListener('keyup', this.onStrokeColorChange);
        this.strokeDasharray.addEventListener('change', this.onStrokeDasharrayChange);
        this.strokeDasharray.addEventListener('keyup', this.onStrokeDasharrayChange);
    }

    this.onStrokeColorPickerChange = (red,green,blue,alpha) => {
        const hexString = "#"+rgba2hex(red,green,blue,1).toString().substring(0,6);
        if (hexString === this.strokeColor.value) {
            return
        }
        this.strokeColor.value = hexString;
        setColorInput(this.strokeColor,this.strokeColorPicker,hexString);
        if (this.panel.selectedShape) {
            this.onStrokeColorChange({target: this.strokeColor,key:"a"});
            this.updateShape();
        }
    }

    this.onStrokeColorChange = (event) => {
        setColorInput(this.strokeColor,this.strokeColorPicker,event.target.value+"ff");
        if (!isColorSymbol(event.key)) {
            return
        }
        this.panel.selectedShape.setOptions({style:{stroke:event.target.value.substring(0,8)}});
        this.updateShape();
    }

    this.loadStrokeOptions = () => {
        const options = this.panel.selectedShape.options.style;
        this.strokeColor.value = options.stroke || "#000000";
        this.strokeWidth.value = options["stroke-width"];
        this.strokeDasharray.value = options["stroke-dasharray"];
        this.strokeLinecap.value = options["stroke-linecap"] || "square";
        this.onStrokeColorChange({target:this.strokeColor});
        this.strokeLinecap.querySelector("option").removeAttribute("selected");
        this.strokeLinecap.querySelector("option[value='"+this.strokeLinecap.value+"']").setAttribute("selected", "true");
    }

    this.onStrokeLinecapChange = (event) => {
        this.panel.selectedShape.setOptions({style:{"stroke-linecap":event.target.value}});
        this.updateShape();
    }

    this.onStrokeWidthChange = (event) => {
        this.panel.selectedShape.setOptions({style:{"stroke-width":event.target.value}});
        this.updateShape();
    }

    this.onStrokeDasharrayChange = (event) => {
        this.panel.selectedShape.setOptions({style:{"stroke-dasharray":event.target.value}});
        this.updateShape();
    }

    this.updateShape = () => {
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
        setTimeout(() => {
            const newText = stylesToString(this.panel.selectedShape.options.style);
            if (newText !== this.panel.cssEditor.getValue()) {
                this.panel.cssEditor.getDoc().setValue(newText);
                this.panel.cssTextArea.value = newText;
            }
        },100);
    }
}
