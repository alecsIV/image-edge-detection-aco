const uploader = document.getElementById('image-upload');
const image = document.getElementById("image-output");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');


uploader.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            console.log(this);
            image.style.display = 'block';
            image.setAttribute('src', this.result);
            drawMatrix(this.result);
        })
        reader.readAsDataURL(file)
    }
});

function drawMatrix (source) {
    const img = new Image();
    img.src = img
    ctx.drawImage(img, 0, 0);
const imgData = ctx.getImageData(0, 0, 500, 500).data;
console.log(imgData);
}
