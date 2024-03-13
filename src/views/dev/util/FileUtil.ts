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
}