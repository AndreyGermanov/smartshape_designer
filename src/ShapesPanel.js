import {EventsManager, SmartShape, SmartShapeManager,ShapeEvents} from "./SmartShapeConnector.js";
import {Events} from "./events.js";
import {applyAspectRatio} from "./utils/geometry.js";
import {uploadTextFile} from "./utils/uploadFile.js";
import {showAlert} from "./utils/index.js";

export default function ShapesPanel() {

    this.collectionName = "new";

    this.shapes = [];
    this.element = document.querySelector("#shapes_panel");
    this.init = async() => {
        this.createHiddenInputs();
        this.setEventListeners();
        setTimeout(async() => {
            for (let shape of SmartShapeManager.getShapes()) {
                await this.updateShape(shape);
            }
        },100)
    }

    this.createHiddenInputs = () => {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.id = "uploadFile"
        input.style.display = "none";
        input.addEventListener("change",this.uploadFile)
        const form = document.createElement("form");
        form.id = "uploadForm";
        form.appendChild(input)
        this.element.appendChild(form);
        const a = document.createElement("a");
        a.id = "downloadLink"
        a.style.display = 'none';
        this.element.appendChild(a);
    }

    this.setEventListeners = () => {
        this.element.querySelector("#panelAddBtn").addEventListener("click", this.addShape)
        EventsManager.subscribe("create",(event) => {
            if (event.target.eventListener &&
                event.target.options &&
                event.target.options.id &&
                event.target.options.id.search("_clone") === -1 &&
                event.target.options.id.search("_child") === -1 &&
                event.target.options.id.search("_resizebox") === -1 &&
                event.target.options.id.search("_rotatebox") === -1 &&
                !event.target.getParent()
            ) {
                if (!event.parent) {
                    event.target.hide();
                    this.addShapeCell(event.target);
                }
            }
        })
        EventsManager.subscribe(Events.SELECT_SHAPE, (event) => {
            this.selectShape(event.target);
        })
        EventsManager.subscribe("destroy", this.onShapeDestroyed);
        this.element.querySelector("#panelSaveBtn").addEventListener("click", this.onSaveClick);
        this.element.querySelector("#panelLoadBtn").addEventListener("click", this.onLoadClick);
        EventsManager.subscribe([
            ShapeEvents.SHAPE_MOVE,
            ShapeEvents.SHAPE_RESIZE,
            ShapeEvents.SHAPE_ROTATE,
            ShapeEvents.POINT_DRAG_MOVE,
            ShapeEvents.POINT_ADDED,
            ShapeEvents.POINT_DESTROYED
        ],async(event) => {
            if (event.target.points &&
                event.target.options.id.search("_resizebox") === -1 &&
                event.target.options.id.search("_rotatebox") === -1 &&
                event.target.points.length) {
                const parent = event.target.getParent();
                if (parent) {
                    await this.updateShape(parent);
                } else {
                    await this.updateShape(event.target);
                }

            }
        });
        EventsManager.subscribe(Events.CHANGE_SHAPE_OPTIONS,async(event) => {
            const parent = event.target.getParent();
            if (parent) {
                await this.updateShape(parent);
            } else {
                await this.updateShape(event.target);
            }
        });
        EventsManager.subscribe(Events.REPLACE_SHAPE, (event) => {
            this.replaceShapeCell(event.target,event.oldShape);
        })
    }

    this.addShape = () => {
        const shape = new SmartShape().init(document.querySelector("#shape_container"),{
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
            moveToTop: false,
            forceCreateEvent:true,
            groupChildShapes:false
        },[[0,100],[100,0],[200,100]]);
        EventsManager.emit(Events.SELECT_SHAPE,shape);
    }

    this.addShapeCell = (shape) => {
        const id = "row_"+shape.guid;
        if (this.element.querySelector("#"+id)) {
            return
        }
        const row = this.element.querySelector(".shape_row").cloneNode(true);
        row.id = id
        row.addEventListener("click", this.onShapeRowClick);
        const deleteBtn = row.querySelector("span.fa");
        deleteBtn.id = "delete_"+shape.guid;
        deleteBtn.addEventListener("click",this.onDeleteShapeClick);
        row.style.display = '';
        this.element.querySelector(".shape_row").parentNode.appendChild(row);
        this.updateShape(shape);
    }

    this.replaceShapeCell = (shape,oldShape) => {
        const row = this.element.querySelector("#row_"+oldShape.guid);
        if (!row) {
            return;
        }
        row.id = "row_"+shape.guid;
        const deleteBtn = row.querySelector("span.fa");
        deleteBtn.id = "delete_"+shape.guid;
        this.updateShape(shape);
    }

    this.updateShape = async (shape) => {
        const row = this.element.querySelector("#row_"+shape.guid)
        if (!row) {
            return;
        }
        const img = row.querySelector("img");
        shape.calcPosition();
        const pos = shape.getPosition(true);
        const [width,height] = applyAspectRatio(null, 60, pos.width, pos.height);
        img.style.width = width + "px";
        img.style.height = height + "px";
        img.src = await shape.toPng("dataurl",width,height,true);
        row.querySelector(".shape_name").innerHTML = shape.options.name;
        row.querySelector(".shape_id").innerHTML = "("+shape.options.id+")";
        this.setupShapeContextMenu(shape);
    }

    this.setupShapeContextMenu = (shape) => {
        if (shape.contextMenu && !shape.contextMenuUpdated) {
            shape.contextMenu.on("show",() => {
                const destroyId = shape.contextMenu.items.findIndex(item => item.id === "i"+shape.guid+"_destroy");
                let img = null;
                if (destroyId !== -1) {
                    img = shape.contextMenu.items[destroyId].image;
                    shape.contextMenu.items.splice(destroyId,1)
                }
                const deleteId = shape.contextMenu.items.findIndex(item => item.id === "i"+shape.guid+"_delete");
                if (deleteId === -1) {
                    shape.contextMenu.addItem("i"+shape.guid+"_delete","Destroy",img);
                }
            })
            shape.contextMenu.on("click", (event) => {
                if (event.itemId === "i" + shape.guid + "_clone") {
                    setTimeout(() => {
                        const parent = shape.getRootParent();
                        if (parent) {
                            parent.addChild(SmartShapeManager.activeShape);
                        } else {
                            shape.addChild(SmartShapeManager.activeShape);
                        }
                        if (shape.contextMenu) {
                            this.setupShapeContextMenu(shape);
                            shape.displayGroupItems();
                        }
                        if (SmartShapeManager.activeShape.contextMenu) {
                            this.setupShapeContextMenu(SmartShapeManager.activeShape);
                            SmartShapeManager.activeShape.displayGroupItems();
                        }
                    },100)
                } else if (event.itemId === "i" + shape.guid + "_delete") {
                    this.onDestroyShape(shape);
                }
            })
            shape.contextMenuUpdated = true;
        }
    }

    this.onDestroyShape = (shape) => {
        const parent = shape.getRootParent();
        if (parent && parent.options.groupChildShapes) {
            parent.destroy();
            return;
        }
        const children = shape.getChildren(true);
        if (!children.length || shape.options.groupChildShapes) {
            shape.destroy();
            return;
        }
        const child = children.shift();
        shape.removeAllChildren(true);
        children.forEach(item => child.addChild(item));
        EventsManager.emit(Events.REPLACE_SHAPE,child,{oldShape:shape});
        shape.destroy();
        EventsManager.emit(Events.SELECT_SHAPE,child);
    }

    this.selectShape = (shape) => {
        const selectedShape = this.element.querySelector("#row_"+shape.guid);
        if (!selectedShape) {
            return
        }
        const prevItem = this.element.querySelector(".selected");
        if (prevItem) {
            prevItem.classList.remove("selected");
        }
        selectedShape.classList.add("selected");
    }

    this.onShapeRowClick = (event) => {
        let target = event.target;
        if (event.target.tagName === "SPAN" && event.target.classList.contains("fa")) {
            this.onDeleteShapeClick(event);
            return;
        }
        while (target !== null) {
            if (typeof(target.className) === "string" && target.className.search("shape_row") !== -1) {
                break;
            }
            target = target.parentNode;
        }
        const guid = target.id.replace("row_","");
        const shape = SmartShapeManager.getShapeByGuid(guid);
        if (shape) {
            EventsManager.emit(Events.SELECT_SHAPE, shape);
        }
    }

    this.onDeleteShapeClick = (event) => {
        const guid = event.target.id.replace("delete_","");
        const shape = SmartShapeManager.getShapeByGuid(guid);
        if (shape) {
            shape.getChildren(true).forEach(child => child.destroy());
            shape.destroy();
        }
    }

    this.onShapeDestroyed = (event) => {
        const guid = event.target.guid;
        const row = this.element.querySelector("#row_"+guid);
        if (row && row.parentNode) {
            row.parentNode.removeChild(row);
        }
    }

    this.onSaveClick = () => {
        const shapes = SmartShapeManager.getShapes();
        if (!shapes.length) {
            alert("No shapes to save");
            return
        }
        const jsonString = SmartShapeManager.toJSON(shapes);
        const blob = new Blob([jsonString]);
        const url = window.URL.createObjectURL(blob);
        const a = document.querySelector("#downloadLink");
        a.download = this.collectionName+".json";
        a.href = url;
        a.click();
        window.URL.revokeObjectURL(url);
    }


    this.onLoadClick = () => {
        const input = this.element.querySelector("input[type='file']");
        input.click();
    }

    this.uploadFile = async(event) => {
        const result = await uploadTextFile(event.target);
        if (!result) {
            showAlert("Could not load collection");
        }
        const parts = result.name.split(".");
        if (parts.length>1) {
            parts.pop();
        }
        this.collectionName = parts.join(".")
        SmartShapeManager.clear();
        SmartShapeManager.fromJSON(document.querySelector("#shape_container"),result.data);
        if (SmartShapeManager.getShapes().length === 0) {
            alert("Could not load collection");
        } else {
            setTimeout(() => {
                this.element.querySelector("#uploadForm").reset();
                EventsManager.emit(Events.SELECT_SHAPE,SmartShapeManager.getShapes()[0]);
            },100)
        }
    }
}
