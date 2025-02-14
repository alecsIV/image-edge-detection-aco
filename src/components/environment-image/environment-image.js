/* -------------------------------------------------------------------------- */
/*                       Image Environment data gatherer class                */
/* -------------------------------------------------------------------------- */

export default class EnvironmentImage {
    constructor(image, canvas) {
        this.pixelArray = this.getPixelArray(image, canvas); // set image environment
        this.width = image.width; 
        this.height = image.height;
        this.pixelAmount = Math.abs(this.width * this.height); // get the pixel count in the given image
        imageIntensityArray1d = this.getIntensityArray(); // get intensity data
        imageIntensityArray = this.convertTo2dMatrix(imageIntensityArray1d); // transform intensity data from array into a matrix
    }

    convertTo2dMatrix(array) {
        const array2d = new Array(2);

        let a = 0;

        for (let y = 0; y < canvasHeight; y++) {
            array2d[y] = [];
            for (let x = 0; x < canvasWidth; x++) {
                array2d[y][x] = array[a];
                a++
            }
        }
        return array2d;
    }

    getIntensityArray() {
        // Get intensity data for every pixel by combining the 3 colour and 1 alpha channel values together
        const intensityArray = [];
        for (let i = 0; i <= this.pixelArray.length - 1; i++) {
            if (i <= this.pixelArray.length - 2) {
                const sum = this.pixelArray[i] + this.pixelArray[i + 1] + this.pixelArray[i + 2] + this.pixelArray[i + 3];
                i += 3;
                intensityArray.push(sum);
            }
        };
        return intensityArray;
    }

    getPixelArray(image, canvas) {
        //get image pixel data 
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImageProp(ctx, image, 0, 0, canvas.width, canvas.height);
        global.imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        fadeImage();
        return imgData.data;

        function fadeImage() {
            // fade image in the background 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.globalAlpha = 0.5;
            drawImageProp(ctx, image, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
            // Resize image to fit in the canvas
            if (arguments.length === 2) {
                x = y = 0;
                w = ctx.canvas.width;
                h = ctx.canvas.height;
            }

            // default offset is center
            offsetX = typeof offsetX === "number" ? offsetX : 0.5;
            offsetY = typeof offsetY === "number" ? offsetY : 0.5;

            // keep bounds [0.0, 1.0]
            if (offsetX < 0) offsetX = 0;
            if (offsetY < 0) offsetY = 0;
            if (offsetX > 1) offsetX = 1;
            if (offsetY > 1) offsetY = 1;

            const iw = img.width,
                ih = img.height,
                r = Math.min(w / iw, h / ih)

            let nw = iw * r, // new prop. width
                nh = ih * r, // new prop. height
                cx, cy, cw, ch, ar = 1;

            // decide which gap to fill    
            if (nw < w) ar = w / nw;
            if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
            nw *= ar;
            nh *= ar;

            // calc source rectangle
            cw = iw / (nw / w);
            ch = ih / (nh / h);

            cx = (iw - cw) * offsetX;
            cy = (ih - ch) * offsetY;

            // make sure source rectangle is valid
            if (cx < 0) cx = 0;
            if (cy < 0) cy = 0;
            if (cw > iw) cw = iw;
            if (ch > ih) ch = ih;

            // fill image in dest. rectangle
            ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
        }
    }
}
