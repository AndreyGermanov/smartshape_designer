export const stylesToString = (stylesObj) => {
    const strings = [];
    for (let name in stylesObj) {
        strings.push(name+":"+stylesObj[name]);
    }
    return strings.join("\n")
}

export const stringToStyles = (styleString) => {
    const strings = styleString.split("\n");
    const result = {};
    strings.forEach(string => {
        const parts = string.split(":")
        const name = parts.shift();
        result[name] = parts.join(":").replace(";","");
    })
    return result;
}
