const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);

function loadImage(event) {
  const file = event.target.files[0];

  if (!isFileImage(file)) {
    alertError('Please select an image');
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

function sendImage(event) {
  event.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertError('Please select an image');
    return;
  }

  if (width === '' || height === '') {
    alertError('Please fill in height and width');
    return;
  }

  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  });
}

ipcRenderer.on('image:done', () => {
  alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
});

function isFileImage(file) {
  const accepted = ['image/gif', 'image/png', 'image/jpeg'];

  return file && accepted.includes(file['type']);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}
