export const rgba2hex = (red,green,blue,alpha) => {
    let hex = (red | 1 << 8).toString(16).slice(1) +
            (green | 1 << 8).toString(16).slice(1) +
            (blue | 1 << 8).toString(16).slice(1)

    if (alpha === "") {
        alpha = 1
    }
    // multiply before convert to HEX
    alpha = ((alpha * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + alpha;

    return hex;
}

export const getColorBrightness = (red,green,blue) => {
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export const hex2rgba = (hexString) => {
    let c;
    if(/^#([A-Fa-f0-9]{4}){1,2}$/.test(hexString)){
        c=hexString.substring(1).split('');
        if(c.length===4){
            c=[c[0], c[0], c[1], c[1], c[2], c[2],c[3],c[3]];
        }
        hexString = c.join("");
        const r = parseInt(hexString.slice(0, 2), 16),
            g = parseInt(hexString.slice(2, 4), 16),
            b = parseInt(hexString.slice(4, 6), 16),
            a = parseInt(hexString.slice(6, 8),16)/255
        return [r,g,b,a];
    }
    return null
}

export const setColorInput = (input,picker,color) => {
    let rgba = hex2rgba(color);
    if (!rgba) {
        rgba = [0,0,0,1]
    }
    const brightness = getColorBrightness(...rgba);
    input.style.backgroundColor = "#"+rgba2hex(...rgba);
    input.style.color = brightness > 160 ? 'black' : 'white';
    picker.set(...rgba,false);
}

export const isColorSymbol = (symbol) => {
    return symbol && symbol.length === 1 && (isAlphaNum(symbol) || symbol === "#");
}

const isAlphaNum = (symbol) => {
    const code = symbol.charCodeAt(0);
    return (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122)
}
