import {EventsManager, SmartShape, SmartShapeManager} from "./smart_shape/src/index.js";
import {Events} from "./events.js";
export default function ShapesPanel() {

    this.shapes = [];
    this.element = document.querySelector("#shapes_panel");
    this.init = () => {
        this.setEventListeners();
    }

    this.setEventListeners = () => {
        this.element.querySelector("#panelAddBtn").addEventListener("click", this.addShape)
        EventsManager.subscribe(Events.ADD_SHAPE,(event) => {
            this.addShapeCell(event.target);
        })
        EventsManager.subscribe(Events.SELECT_SHAPE, (event) => {
            this.selectShape(event.target);
        })
        this.element.querySelector("td")

    }

    this.addShape = () => {
        const shape = new SmartShape().init(document.querySelector("#shape_container"),{
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

    this.addShapeCell = (shape) => {
        const row = this.element.querySelector(".shape_row").cloneNode(true);
        row.querySelector("td").id = "row_"+shape.guid;
        row.querySelector("td").addEventListener("click", (event) => {
            let target = event.target;
            while (target !== null && target.tagName !== 'TD') {
                target = target.parentNode;
            }
            const guid = target.id.replace("row_","");
            const shape = SmartShapeManager.getShapeByGuid(guid);
            if (shape) {
                EventsManager.emit(Events.SELECT_SHAPE, shape);
            }
        }, {capture:true},true);
        row.style.display = '';
        this.element.querySelector(".shape_row").parentNode.appendChild(row);
        this.updateShape(shape)
        EventsManager.emit(Events.SELECT_SHAPE,shape);
    }

    this.updateShape = (shape) => {
        const clone = shape.clone();
        clone.scaleTo(null,60);
        clone.redraw();
        this.element.querySelector("#row_"+shape.guid).querySelector("div").innerHTML = clone.toSvg();
        clone.destroy();
    }

    this.selectShape = (shape) => {
        this.element.querySelectorAll(".shape_row td").forEach(node => {
            node.classList.remove("selected");
        })
        this.element.querySelector("#row_"+shape.guid).classList.add("selected");
    }


}
