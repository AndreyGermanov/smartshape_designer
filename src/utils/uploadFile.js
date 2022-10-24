export const uploadTextFile = (target) => {
    return new Promise(resolve => {
        if (!target.files || !target.files.length) {
            resolve(null);
        }
        const file = target.files[0]
        const filename = file.name;
        const reader = new FileReader();
        reader.onloadend = (event) => {
            if (!event.target.result) {
                resolve(null);
                return
            }
            resolve({name:filename,data:event.target.result})
        }
        reader.readAsText(file);
    })
}
