export class FileUtil{
    static createImageBitmapFromDataUrl(url : string) : Promise<ImageBitmap|null>
    {
        return new Promise(function(resolve, reject) {
            const image = document.createElement("img");                    
            image.src = url;
            image.onload = () => {
                createImageBitmap(image)
                    .then(imageBitmap => {        
                        resolve(imageBitmap);
                    })
                    .catch(() => {
                        resolve(null);
                    });
            };
            image.onerror = () => {
                resolve(null);
            }
        });        
    }

    static readJsonFromLocalFile(fileInfo : Blob) : Promise<string> {
        return new Promise(function(resolve, reject) {        
            const reader = new FileReader();
            reader.onload = (e) => { 
                if(!e.target || !e.target.result) {
                    reject('null result');
                }
                else if(typeof e.target.result === 'string'){
                    resolve(e.target.result);
                }
                else {
                    reject('invalid result');
                }
            };
            reader.onerror = (e) => {
                reject(reader.error);
            };     
            reader.readAsText(fileInfo);
        });
    }
}