import {Events} from "./events.js";
import {EventsManager,SmartShape,SmartShapeManager,SmartShapeDisplayMode} from "./smart_shape/src/index.js";
import {Menus} from "../context_menu/src/index.js";
import Add from "./assets/list-add.png";

export default function Editor() {
    this.selectedShape = null;
    this.element = document.querySelector("#editor");
    this.menu = null
    this.studio = null;

    this.init = (studio) => {
        this.studio = studio;
        this.setupMenu();
        this.setDisplayMode();
        this.setEventListeners();
    }

    this.setupMenu = () => {
        this.menu =Menus.create([{id:"add_shape",title:"Add shape",image:Add}],
            document.getElementById("editorMenuBtn"),'click');
        this.menu.on("show", (event) => {
            if (!this.selectedShape || this.selectedShape.points.length < 3) {
                setTimeout(() => {
                    this.menu.hide();
                },10);
            }
        })
        this.menu.on("click", (event) => {
            if (event.itemId === "add_shape") {
                const childCount = this.selectedShape.getChildren(true).length;
                const shape = new SmartShape().init(this.selectedShape.root,{
                    id:this.selectedShape.options.id+"_child"+childCount,
                        name: "Shape #" + SmartShapeManager.shapes.length,
                        canAddPoints: true,
                        canDrag: true,
                        canScale: true,
                        canRotate: true,
                        pointOptions:{
                            canDrag:true,
                            canDelete:true
                        },
                    },
                    [[0,100],[100,0],[200,100]]);
                this.selectedShape.addChild(shape);
                SmartShapeManager.activateShape(shape);
                this.studio.shapesPanel.setupShapeContextMenu(shape);
            }
        })
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
        EventsManager.subscribe("destroy", this.onShapeDestroyed)
        EventsManager.subscribe(Events.CHANGE_SHAPE_OPTIONS,this.onChangeShapeOptions);
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
            },
            forceCreateEvent:true,
        });
        EventsManager.emit(Events.ADD_SHAPE,shape);
    }

    this.selectShape = (event) => {
        this.selectedShape = event.target;
        SmartShapeManager.getShapes().filter(shape=>shape !== this.selectedShape).forEach(shape=>shape.hide());
        this.selectedShape.show();
        SmartShapeManager.activateShape(this.selectedShape,SmartShapeDisplayMode.SELECTED);
        this.setDisplayMode();
    }

    this.onShapeDestroyed = (event) => {
        if (event.target === this.selectedShape) {
            this.selectedShape = null;
            this.setDisplayMode();
        }
    }

    this.onChangeShapeOptions = (event) => {
        const parent = event.target.getParent();
        if (event.target === this.selectedShape || (parent && parent.guid === this.selectedShape.guid)) {
            event.target.redraw();
        }
    }
}
