import ACO from './aco-algorithm';
import EnvironmentImage from './environment-image';

const uploader = document.querySelector('#image-upload');
const image = document.querySelector('#image-source');
const imagePreview = document.querySelector('#image-preview');
const canvas = document.querySelector('#canvas');
const drawImageButton = document.querySelector('#draw-image-button')


// Buttons and HTML events
uploader.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            image.setAttribute('src', this.result);
            imagePreview.setAttribute('src', this.result);
        })
        reader.readAsDataURL(file)
        drawImageButton.removeAttribute('disabled');
    }
});

drawImageButton.addEventListener('click', function() {
    if (image) {
        const envImage = new EnvironmentImage(image, canvas);
        let algorithm = new ACO(envImage);
    }
});