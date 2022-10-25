import {deepmerge} from "./deepmerge.js";

export const showAlert = (message,_header) => {
    alert(message);
}

export const notNull = (value) => {
    return typeof(value) !== "undefined" && value !== null;
}

export const mergeObjects = (...objects) => {
    if (!objects.length) {
        return null;
    }
    let result = objects[0];
    if (objects.length === 1) {
        return result;
    }
    for (let index=1;index<objects.length;index++) {
        if (notNull(objects[index]) && typeof(objects[index]) === "object") {
            result = deepmerge(result, objects[index]);
        }
    }
    return result;
}
