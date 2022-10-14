import {getColorBrightness, hex2rgba, rgba2hex} from "../utils/color.js";
import {EventsManager} from "../smart_shape/src/index.js";
import {Events} from "../events.js";
export default function FillTab (panel) {
    this.panel = panel

    this.colorFillPicker = CP(document.querySelector("#fillTypeColorInput"));
    this.fillColorInput =  this.panel.element.querySelector("#fillTypeColorInput");
    this.fillColorColumn = this.panel.element.querySelector("#fillTypeColor");
    this.fillTypeDropDown = this.panel.element.querySelector("#fillType")
    this.fillGradientType = this.panel.element.querySelector("#fillGradientType");
    this.fillGradientAngle = this.panel.element.querySelector("#fillGradientAngle");
    this.fillGradientTable = this.panel.element.querySelector("#fillGradientTable");
    this.fillTypeGradient = this.panel.element.querySelector("#fillTypeGradient");
    this.fillGradientAddBtn = this.panel.element.querySelector("#fillGradientAddBtn");
    this.fillTypeImage = this.panel.element.querySelector("#fillTypeImage");
    this.fillImageSelectBtn = this.panel.element.querySelector("#selectImageBtn");
    this.fillImage = this.panel.element.querySelector("#fillImg");
    this.fillImageWidth = this.panel.element.querySelector("#fillImageWidth");
    this.fillImageHeight = this.panel.element.querySelector("#fillImageHeight");

    this.init = () => {
        this.setFillEventListeners();
        return this;

    }

    this.setFillEventListeners = () => {
        this.colorFillPicker.on('change', this.onFillColorPickerChange);
        this.fillTypeDropDown.addEventListener('change',this.onFillTypeChange);
        this.fillColorInput.addEventListener('change', this.onFillColorChange);
        this.fillColorInput.addEventListener('keyup', this.onFillColorChange);
        this.fillGradientType.addEventListener('change',this.updateGradientData);
        this.fillGradientAngle.addEventListener('change',this.onFillGradientAngleChange);
        this.fillGradientAngle.addEventListener('keyup',this.onFillGradientAngleChange);
        this.fillGradientAddBtn.addEventListener("click",() => {
            this.addGradientStep()
        });
        this.fillImageSelectBtn.addEventListener('click',this.onSelectImage);
        this.fillImageWidth.addEventListener("keyup", () => this.updateImageData());
        this.fillImageHeight.addEventListener("keyup", () => this.updateImageData());
        this.fillImageWidth.addEventListener("change", () => this.updateImageData());
        this.fillImageHeight.addEventListener("change", () => this.updateImageData());
        this.fillImage.addEventListener("load", () => {
            this.fillImage.width = 100;
            this.fillImage.height = 100;
            this.fillImage.style.display = '';
        })
    }

    this.onFillColorPickerChange = (red,green,blue,alpha) => {
        const hexString = "#"+rgba2hex(red,green,blue,alpha);
        if (hexString === this.fillColorInput.value) {
            return
        }
        const brightness = getColorBrightness(red,green,blue);
        this.fillColorInput.style.backgroundColor = hexString;
        this.fillColorInput.style.color = brightness > 160 ? 'black' : 'white';
        this.fillColorInput.value = hexString;
        if (this.panel.selectedShape) {
            this.onFillColorChange({target: this.fillColorInput});
            EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS, this.panel.selectedShape);
        }
    }

    this.onFillTypeChange = (event) => {
        this.fillColorColumn.style.display = 'none';
        this.fillTypeGradient.style.display = 'none';
        this.fillTypeImage.style.display = 'none';
        switch (event.target.value) {
            case "none":
                this.panel.selectedShape.setOptions({fill:'none',fillGradient:null,fillImage:null})
                break;
            case "color":
                this.fillColorColumn.style.display = '';
                this.panel.selectedShape.setOptions({fill:this.fillColorInput.value,fillGradient:null,fillImage:null})
                break;
            case "gradient":
                this.fillTypeGradient.style.display = '';
                const fillGradient = this.getGradientData();
                this.panel.selectedShape.setOptions({fill:'none',fillGradient,fillImage:null});
                break;
            case "image":
                this.fillTypeImage.style.display = '';
                const fillImage = this.getFillImageData()
                if (fillImage) {
                    this.panel.selectedShape.setOptions({fill: 'none', fillImage, fillGradient: null});
                }
                break;
        }
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
    }

    this.onFillColorChange = (event) => {
        const rgba = hex2rgba(event.target.value);
        if (!rgba) {
            return
        }
        const brightness = getColorBrightness(...rgba);
        this.fillColorInput.style.backgroundColor = event.target.value;
        this.fillColorInput.style.color = brightness > 160 ? 'black' : 'white';
        this.colorFillPicker.set(...rgba);
        this.panel.selectedShape.setOptions({fillGradient:null,fillImage:null,fill:event.target.value});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS, this.panel.selectedShape);
    }

    this.loadFillOptions = () => {
        this.fillColorColumn.style.display = 'none'
        this.fillTypeGradient.style.display = 'none';
        this.fillTypeImage.style.display = 'none';
        this.fillImage.removeAttribute("src");
        this.fillImageWidth.value = 0;
        this.fillImageHeight.value = 0;
        Array.from(this.fillGradientTable.querySelectorAll("tr"))
            .filter(item => item.style.display !== "none" && !item.querySelectorAll("th").length)
            .forEach(item => item.parentNode.removeChild(item));
        this.fillGradientAngle.value = 0;
        this.fillGradientType.value = "linear";
        this.fillGradientType.querySelector("option").removeAttribute("selected");
        this.fillGradientType.querySelector("option[value='linear']").setAttribute("selected", "true");
        this.fillColorInput.value = "#000000ff";
        if (this.panel.selectedShape.options.fill.toString().length && this.panel.selectedShape.options.fill !== "none") {
            this.fillColorColumn.style.display = '';
            this.fillColorInput.style.backgroundColor = this.panel.selectedShape.options.fill;
            this.fillColorInput.value = this.panel.selectedShape.options.fill;
            this.fillTypeDropDown.value = "color";
            this.fillTypeDropDown.querySelector("option").removeAttribute("selected");
            this.fillTypeDropDown.querySelector("option[value='color']").setAttribute("selected", "true");
        } else if (this.panel.selectedShape.options.fillImage !== null) {
            this.fillTypeImage.style.display = '';
            if (this.fillImage.src !== this.panel.selectedShape.options.fillImage.href) {
                this.fillImage.src = this.panel.selectedShape.options.fillImage.href;
            }
            this.fillImageWidth.value = parseInt(this.panel.selectedShape.options.fillImage.width);
            this.fillImageHeight.value = parseInt(this.panel.selectedShape.options.fillImage.height);
            this.fillTypeDropDown.querySelector("option").removeAttribute("selected");
            this.fillTypeDropDown.querySelector("option[value='image']").setAttribute("selected","true");
        } else if (this.panel.selectedShape.options.fillGradient !== null) {
            this.fillTypeDropDown.value = "gradient";
            this.fillTypeGradient.style.display = '';
            this.fillGradientAngle.value = this.parseGradientAngle()
            this.fillGradientType.value = this.panel.selectedShape.options.fillGradient.type;
            this.fillGradientType.querySelector("option").removeAttribute("selected");
            this.fillGradientType.querySelector("option[value='"+this.fillGradientType.value+"']").setAttribute("selected","true");
            this.createGradientTable();
        } else {
            this.fillTypeDropDown.value = "none";
            this.fillTypeDropDown.querySelector("option").removeAttribute("selected");
            this.fillTypeDropDown.querySelector("option[value='none']").setAttribute("selected","true");
        }
    }

    this.parseGradientAngle = () => {
        const transform = this.panel.selectedShape.options.fillGradient ? this.panel.selectedShape.options.fillGradient.gradientTransform : null;
        if (!transform) {
            return 0;
        }
        return parseInt(transform.replace("rotate(",""))
    }

    this.createGradientTable = () => {
        if (!this.panel.selectedShape.options.fillGradient) {
            return
        }
        const steps = this.panel.selectedShape.options.fillGradient.steps;
        if (!steps || typeof(steps) === "undefined") {
            return
        }
        steps.forEach(step => this.addGradientStep(step))
    }

    this.getGradientData = () => {
        if (this.panel.selectedShape.fillGradient) {
            return this.panel.selectedShape.fillGradient
        }
        return { angle:0, steps:[]};
    }

    this.addGradientStep = (gradientStep=null) => {
        const row = this.fillGradientTable.querySelector("#fillGradientTemplateRow").cloneNode(true);
        const index = this.panel.selectedShape.options.fillGradient.steps.length;
        row.id = "fill_gradient_step_"+index;
        row.style.display = '';
        const deleteBtn = row.querySelector("button")
        deleteBtn.addEventListener('click',() => this.deleteGradientStep(index))
        const offset = row.querySelector("input.offset");
        offset.addEventListener("keyup",this.updateStepOffset);
        offset.addEventListener("change",this.updateStepOffset)
        const color = row.querySelector("input.color");
        if (gradientStep) {
            offset.value = parseInt(gradientStep.offset);
            color.value = gradientStep.stopColor;
        }
        const colorPicker = CP(color);
        if (gradientStep) {
            const rgba = hex2rgba(gradientStep.stopColor);
            if (rgba) {
                colorPicker.set(...rgba)
            }
        }
        color.addEventListener("keyup",(event) => {
            this.updateStepColor(event,colorPicker);
        })
        color.addEventListener("change",(event) => {
            this.updateStepColor(event,colorPicker);
        })
        colorPicker.on('change', (r,g,b,a) => {
            this.updateStepColorFromPicker(rgba2hex(r,g,b,a),color);
        });
        this.fillGradientTable.querySelector("#fillGradientTemplateRow").parentNode.appendChild(row);
    }

    this.deleteGradientStep = (index) => {
        const row = this.fillGradientTable.querySelector("#fill_gradient_step_"+index);
        row.parentNode.removeChild(row);
        this.updateGradientData();
    }

    this.updateStepOffset = () => {
        this.updateGradientData();
    }

    this.updateStepColor = (event,picker) => {
        const rgba = hex2rgba(event.target.value);
        if (rgba) {
            picker.set(...rgba)
        }
        this.updateGradientData();
    }

    this.updateStepColorFromPicker = (hexString,input) => {
        const rgba = hex2rgba("#"+hexString);
        let brightness = 0;
        if (rgba) {
            brightness = getColorBrightness(...rgba);
        }
        input.style.backgroundColor = "#"+hexString;
        input.style.color = brightness > 160 ? 'black' : 'white';
        input.value = "#"+hexString;
        this.updateGradientData();
    }

    this.onFillGradientAngleChange = () => {
        this.updateGradientData();
    }

    this.updateGradientData = () => {
        const angle = this.fillGradientAngle.value ? this.fillGradientAngle.value : 0;
        const fillGradient = {
            type: this.fillGradientType.value,
            gradientTransform: "rotate("+angle+")",
            steps: []
        }
        fillGradient.steps = Array.from(this.fillGradientTable.querySelectorAll("tr"))
            .filter(item => item.style.display !== "none" && !item.querySelectorAll("th").length)
            .map(row => ({
                offset: parseInt(row.querySelector("input.offset").value)+"%",
                stopColor: row.querySelector("input.color").value
            }))
        this.panel.selectedShape.setOptions({fillGradient});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
    }

    this.updateImageData = () => {
        const fillImage = {
            href: this.fillImage.src,
            width: this.fillImageWidth.value,
            height: this.fillImageHeight.value
        }
        this.panel.selectedShape.setOptions({fill:'none',fillGradient:null,fillImage});
        EventsManager.emit(Events.CHANGE_SHAPE_OPTIONS,this.panel.selectedShape);
    }

    this.getFillImageData = () => {
        if (this.panel.selectedShape.fillImage) {
            return this.panel.selectedShape.fillImage
        }
        return null;
    }

    this.onSelectImage = () => {
        const input = document.createElement("input")
        input.setAttribute("type","file");
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener("change", (event) => {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const img = document.createElement("img");
                img.addEventListener("load",this.onLoadImage);
                img.src = event.target.result;
                this.fillImage.style.display = 'none';
                this.fillImage.src = event.target.result;
                document.body.removeChild(input);
            }
            reader.readAsDataURL(event.target.files[0]);
        })
        input.click();
    }

    this.onLoadImage = (event) => {
        this.fillImageWidth.value = parseInt(event.target.width);
        this.fillImageHeight.value = parseInt(event.target.height);
        this.updateImageData();
    }
}