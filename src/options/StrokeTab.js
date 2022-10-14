import {getColorBrightness, hex2rgba, rgba2hex} from "../utils/color.js";
import {EventsManager} from "../smart_shape/src/index.js";
import {Events} from "../events.js";

export default function StrokeTab (panel) {
    this.panel = panel

    this.strokeColor = this.panel.element.querySelector("#strokeColor");
    this.strokeColorPicker = CP(this.strokeColor);
    this.strokeWidth = this.panel.element.querySelector("#strokeWidth");
    this.strokeLinecap = this.panel.element.querySelector("#strokeLinecap");
    this.strokeColor = this.panel.element.querySelector("#strokeColor");
    this.strokeDasharray = this.panel.element.querySelector("#strokeDasharray");

    this.init = () => {
        this.strokeColorPicker.noAlpha = true;
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
        const brightness = getColorBrightness(red,green,blue);
        this.strokeColor.style.backgroundColor = hexString;
        this.strokeColor.style.color = brightness > 160 ? 'black' : 'white';
        this.strokeColor.value = hexString;
        if (this.panel.selectedShape) {
            this.onStrokeColorChange({target: this.strokeColor});
            EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS, this.panel.selectedShape);
        }
    }

    this.onStrokeColorChange = (event) => {
        const rgba = hex2rgba(event.target.value+"ff");
        if (!rgba) {
            return
        }
        rgba.push(1);
        const brightness = getColorBrightness(...rgba);
        this.strokeColor.style.backgroundColor = event.target.value.substring(0,8);
        this.strokeColor.style.color = brightness > 160 ? 'black' : 'white';
        this.strokeColorPicker.set(...rgba);
        this.panel.selectedShape.setOptions({stroke:event.target.value.substring(0,8)});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS, this.panel.selectedShape);
    }

    this.loadStrokeOptions = () => {
        const options = this.panel.selectedShape.options;
        this.strokeColor.value = options.stroke || "#000000";
        this.strokeWidth.value = options.strokeWidth;
        this.strokeDasharray.value = options.strokeDasharray;
        this.strokeLinecap.value = options.strokeLinecap || "square";
        this.onStrokeColorChange({target:this.strokeColor});
        this.strokeLinecap.querySelector("option").removeAttribute("selected");
        this.strokeLinecap.querySelector("option[value='"+this.strokeLinecap.value+"']").setAttribute("selected", "true");
    }

    this.onStrokeLinecapChange = (event) => {
        this.panel.selectedShape.setOptions({strokeLinecap:event.target.value});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
    }

    this.onStrokeWidthChange = (event) => {
        this.panel.selectedShape.setOptions({strokeWidth:event.target.value});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
    }

    this.onStrokeDasharrayChange = (event) => {
        this.panel.selectedShape.setOptions({strokeDasharray:event.target.value});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
    }
}
