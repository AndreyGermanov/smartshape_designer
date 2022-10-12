import {EventsManager, SmartShape, SmartShapeManager,ShapeEvents} from "./smart_shape/src/index.js";
import {Events} from "./events.js";
import {applyAspectRatio} from "./utils/geometry.js";

export default function ShapesPanel() {

    this.collectionName = "new";

    this.shapes = [];
    this.element = document.querySelector("#shapes_panel");
    this.init = async() => {
        this.setEventListeners();
        setTimeout(async() => {
            for (let shape of SmartShapeManager.getShapes()) {
                await this.updateShape(shape);
            }
        },100)
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
                this.addShapeCell(event.target);
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
        new SmartShape().init(document.querySelector("#shape_container"),{
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
            forceCreateEvent:true
        });
    }

    this.addShapeCell = (shape) => {
        const row = this.element.querySelector(".shape_row").cloneNode(true);
        row.id = "row_"+shape.guid;
        row.addEventListener("click", this.onShapeRowClick);
        const deleteBtn = row.querySelector("span");
        deleteBtn.id = "delete_"+shape.guid;
        deleteBtn.addEventListener("click",this.onDeleteShapeClick);
        row.style.display = '';
        this.element.querySelector(".shape_row").parentNode.appendChild(row);
        shape.setOptions({groupChildShapes:false});
        this.updateShape(shape)
        EventsManager.emit(Events.SELECT_SHAPE,shape);
    }

    this.replaceShapeCell = (shape,oldShape) => {
        const row = this.element.querySelector("#row_"+oldShape.guid);
        if (!row) {
            return;
        }
        row.id = "row_"+shape.guid;
        this.updateShape(shape);
    }

    this.updateShape = async (shape) => {
        const row = this.element.querySelector("#row_"+shape.guid)
        if (!row) {
            return;
        }
        const img = row.querySelector("img");
        shape.calcPosition();
        const pos = shape.getPosition(shape.options.groupChildShapes);
        const [width,height] = applyAspectRatio(null, 60, pos.width, pos.height);
        img.style.width = width + "px";
        img.style.height = height + "px";
        img.src = await shape.toPng("dataurl");
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
        EventsManager.emit(Events.SELECT_SHAPE,child);
        shape.destroy();
    }

    this.selectShape = (shape) => {
        this.element.querySelectorAll(".shape_row").forEach(node => {
            node.classList.remove("selected");
        })
        this.element.querySelector("#row_"+shape.guid).classList.add("selected");
        this.element.scrollTop = this.element.querySelector("#row_"+shape.guid).offsetTop;
    }

    this.onShapeRowClick = (event) => {
        let target = event.target;
        if (event.target.tagName === "SPAN") {
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
        const a = document.createElement("a");
        a.download = this.collectionName+".json";
        a.href = url;
        this.element.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.element.removeChild(a);
    }

    this.onLoadClick = () => {
        const input = document.createElement("input");
        input.setAttribute("type","file");
        input.style.display = "none";
        this.element.appendChild(input);
        input.addEventListener("change",(event) => {
            if (!event.target.files || !event.target.files.length) {
                return;
            }
            const file = event.target.files[0];
            const parts = file.name.split(".");
            if (parts.length>1) {
                parts.pop();
            }
            this.collectionName = parts.join(".")
            const reader = new FileReader();
            reader.onloadend = (event) => {
                SmartShapeManager.clear();
                SmartShapeManager.fromJSON(document.querySelector("#shape_container"),event.target.result);
                if (SmartShapeManager.getShapes().length === 0) {
                    alert("Could not load collection");
                } else {
                    setTimeout(() => {
                        EventsManager.emit(Events.SELECT_SHAPE,SmartShapeManager.getShapes()[0]);
                    },100)
                }
            }
            reader.readAsText(file);
        })
        input.click();
    }
}
