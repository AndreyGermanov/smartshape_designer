/**
 * Function injects specified HTML file to specified HTML
 * node of the current file
 *
 * @param filePath - a path to a source HTML file to inject
 * @param elem - an HTML element to which this content will
 * be injected
 */
export const injectHTML = async(filePath,elem) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            return;
        }
        elem.innerHTML = await response.text();
        elem.querySelectorAll("script").forEach(script => {
            const newScript = document.createElement("script");
            Array.from(script.attributes).forEach(attr =>
                newScript.setAttribute(attr.name, attr.value)
            );
            newScript.appendChild(
                document.createTextNode(script.innerHTML)
            )
            script.parentNode.replaceChild(newScript, script);
        })
    } catch (err) {
        console.error(err.message);
    }
}

/**
 * Function used to process all HTML tags of the following
 * format: <div include="<filename>"></div>
 *
 * This function injects a content of <filename> to
 * each div with the "include" attribute
 */
export const injectAll = async () => {
    let elems = document.querySelectorAll("[include]");
    while (elems.length>0) {
        for (let elem of elems) {
            await injectHTML(elem.getAttribute("include"), elem);
            elem.removeAttribute("include");
        }
        elems = document.querySelectorAll("[include]");
    }
}
