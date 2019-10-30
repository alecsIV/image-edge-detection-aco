const uploader = document.getElementById('image-upload');
const image = document.getElementById("image-output");

uploader.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            console.log(this);
            image.style.display = 'block';
            image.setAttribute('src', this.result)
        })
        reader.readAsDataURL(file);
    }
});
