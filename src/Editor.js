import {Events} from "./events.js";
import {EventsManager,SmartShape,SmartShapeManager} from "./smart_shape/src/index.js";
export default function Editor() {
    this.selectedShape = null;
    this.element = document.querySelector("#editor");

    this.init = () => {
        this.setDisplayMode();
        this.setEventListeners();
    }

    this.setDisplayMode = () => {
        if (!this.selectedShape) {
            this.element.querySelector("#shape_container").style.display = 'none';
            this.element.querySelector("#create_new_shape").style.display = 'flex';
        } else {
            this.element.querySelector("#shape_container").style.display = "flex";
            this.element.querySelector("#create_new_shape").style.display = "none";
        }
    }

    this.setEventListeners = () => {
        this.element.querySelector("#newBtn").addEventListener("click",this.addShape);
        EventsManager.subscribe(Events.SELECT_SHAPE,this.selectShape)
    }

    this.addShape = () => {
        const shape = new SmartShape().init(this.element.querySelector("#shape_container"),{
            id: "shape_"+SmartShapeManager.shapes.length,
            name: "Shape #" + SmartShapeManager.shapes.length,
            canAddPoints: true,
            canDrag: true,
            canScale: true,
            canRotate: true,
            pointOptions:{
                canDrag:true,
                canDelete:true
            }
        },[[0,100],[100,0],[200,100]]);
        EventsManager.emit(Events.ADD_SHAPE,shape);
    }

    this.selectShape = (event) => {
        this.selectedShape = event.target;
        SmartShapeManager.shapes.forEach(shape => {
            if (shape !== this.selectedShape) {
                shape.hide();
            }
        })
        this.selectedShape.show();
        this.setDisplayMode();
    }
}