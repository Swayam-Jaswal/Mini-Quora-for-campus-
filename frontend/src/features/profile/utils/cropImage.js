// utils/cropImage.js
// Client-side cropping helper: returns a Blob representing cropped area (JPEG).
// Works with react-easy-crop's pixel crop values { x, y, width, height }.

export default async function getCroppedImg(imageSrc, pixelCrop) {
  if (!imageSrc) throw new Error('No image source provided');
  if (!pixelCrop) throw new Error('No crop provided');

  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(pixelCrop.width));
      canvas.height = Math.max(1, Math.floor(pixelCrop.height));
      const ctx = canvas.getContext('2d');

      // draw the cropped area onto the canvas
      ctx.drawImage(
        image,
        Math.floor(pixelCrop.x),
        Math.floor(pixelCrop.y),
        Math.floor(pixelCrop.width),
        Math.floor(pixelCrop.height),
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.92
      );
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.src = imageSrc;
  });
}
