/**
 * @ignore
 * Function used to calculate width or height respecting aspect ratio, calculated from `origWidth` and `origHeight`.
 * Either `width` or `height` must be null. Otherwise, just returns width and height
 * @param width {number|null} Destination width. If null, then calculates it
 * @param height {number|null} Destination height. If null, then calculates it
 * @param origWidth {number} Original width used to calculate aspect ratio
 * @param origHeight {number} Original height used to calculate aspect ration
 * @returns {array} Array in the form [width,height] after apply aspect ratio
 */
export const applyAspectRatio = (width,height,origWidth,origHeight) => {
    if (!width && !height || !origWidth || !origHeight) {
        return [origWidth, origHeight];
    }
    if (width && height) {
        return [width,height]
    }
    if (!width) {
        width = height * (origWidth/origHeight);
    }
    if (!height) {
        height = width * (origHeight/origWidth);
    }
    return [width,height]
}
