import {Events} from "./events.js";
import {
    EventsManager,
    SmartShape,
    SmartShapeManager,
    SmartShapeDisplayMode,
    ShapeEvents
} from "./SmartShapeConnector.js";
import {Menus} from "../context_menu/src/index.js";
import Triangle from "./assets/triangle.png";
import Square from "./assets/square.png";
import {uploadTextFile} from "./utils/uploadFile.js";
import {showAlert} from "./utils/index.js";
import {recursiveDeepCopy} from "./smart_shape/src/utils/index.js";

export default function Editor() {
    this.selectedShape = null;
    this.element = document.querySelector("#editor");
    this.menu = null
    this.studio = null;
    this.newShapeOptions = {
        canAddPoints: true,
        canDrag: true,
        canScale: true,
        canRotate: true,
        pointOptions:{
            canDrag:true,
            canDelete:true
        },
        moveToTop: false,
        groupChildShapes:false
    };

    this.init = (studio) => {
        this.studio = studio;
        this.setupMenu();
        this.setDisplayMode();
        this.setEventListeners();
    }

    this.setupMenu = () => {
        this.menu =Menus.create([
            {id:"add_triangle",title:"Add triangle",image:Triangle},
            {id:"add_square",title:"Add square",image:Square},
            {id:"import_json",title:"Import from JSON"}
        ],
            document.getElementById("editorMenuBtn"),'click'
        );
        this.fileInputForm = document.createElement("form");
        this.fileInput = document.createElement("input");
        this.fileInput.type = "file";
        this.fileInput.style.display = 'none';
        this.fileInputForm.appendChild(this.fileInput);
        this.element.appendChild(this.fileInputForm);
        this.setupMenuListeners();
    }

    this.setupMenuListeners = () => {
        this.menu.on("show", () => {
            if (!this.selectedShape || this.selectedShape.points.length < 3) {
                setTimeout(() => {
                    this.menu.hide();
                },10);
            }
        })
        this.menu.on("click", (event) => {
            switch (event.itemId) {
                case "add_triangle":
                    this.addFigure([[0,100],[50,0],[100,100]],recursiveDeepCopy(this.newShapeOptions));
                    break;
                case "add_square":
                    this.addFigure([[0,100],[0,0],[100,0],[100,100]], recursiveDeepCopy(this.newShapeOptions));
                    break;
                case "import_json":
                    this.importJSON()
                    break;
            }
        })
        this.fileInput.addEventListener("change",this.uploadJSON)
    }

    this.addFigure = (points, options) => {
        const childCount = SmartShapeManager.getShapes().length;
        options.id =this.selectedShape.options.id+"_child"+childCount;
        options.name = "Shape #" + SmartShapeManager.length();
        const shape = new SmartShape().init(this.selectedShape.root,options,
            points);
        this.selectedShape.addChild(shape);
        SmartShapeManager.activateShape(shape);
        this.studio.shapesPanel.setupShapeContextMenu(shape);
    }

    this.importJSON = () => {
        this.fileInputForm.reset();
        this.fileInput.click();
    }

    this.uploadJSON = async(event) => {
        const result = await uploadTextFile(event.target);
        if (!result) {
            showAlert("Could not load shape from JSON")
            return;
        }
        const shape = new SmartShape().fromJSON(this.selectedShape.root,result.data,true,false);
        for (let child of shape.getChildren(true)) {
            child.getParent().removeChild(child);
            this.selectedShape.addChild(child);
            child.show();
            child.setOptions({groupChildShapes: this.selectedShape.groupChildShapes});
        }
        shape.setOptions({groupChildShapes: this.selectedShape.groupChildShapes});
        shape.show();
        shape.getChildren(true).forEach(child=>child.show())
        this.selectedShape.addChild(shape);
        EventsManager.emit(ShapeEvents.SHAPE_CREATE,shape);
        SmartShapeManager.activateShape(shape);
        this.studio.shapesPanel.setupShapeContextMenu(shape);
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
            id: "shape_"+SmartShapeManager.length(),
            name: "Shape #" + SmartShapeManager.length(),
            canAddPoints: true,
            canDrag: true,
            canScale: true,
            canRotate: true,
            pointOptions:{
                canDrag:true,
                canDelete:true
            },
            forceCreateEvent:true,
            moveToTop: false,
            groupChildShapes: false
        },[[0,100],[100,0],[200,100]]);
        EventsManager.emit(Events.ADD_SHAPE,shape);
        EventsManager.emit(Events.SELECT_SHAPE,shape);
    }

    this.selectShape = (event) => {
        if (!SmartShapeManager.getShape(event.target) || event.target.getRootParent()) {
            return
        }
        if (this.selectedShape) {
            this.selectedShape.hide();
        }
        this.selectedShape = event.target;
        this.selectedShape.show();
        this.selectedShape.getChildren(true).forEach(shape=>shape.show())
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
