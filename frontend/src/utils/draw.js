import Api from '@/Api'

const imageMap = [
    // 1-3
    { x: 10, y: 10 },
    { x: 110, y: 10 },
    { x: 210, y: 10 },
    // 4-6
    { x: 10, y: 110 },
    { x: 110, y: 110 },
    { x: 210, y: 110 },
    // 7-9
    { x: 10, y: 210 },
    { x: 110, y: 210 },
    { x: 210, y: 210 },
]

/**
 * input img urls 
 * use canvas to draw a combine image
 * upload to backend url
 * output combine image url 
 *
 * @export image url
 * @param {*} imgs
 */
export async function drawCombineImage(images) {
    if (images.length > 9) {
        images = images.slice(0, 9)
    }
    const canvas = document.createElement('canvas');
    canvas.width = 310;
    canvas.height = 310;
    const ctx = canvas.getContext('2d');
    const imgDom = await Promise.all(images.map(url => new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = url;
        img.width = '90'
        img.height = '90'
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    })));
    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    imgDom.forEach((image, i) => {
        ctx.drawImage(
            image,
            imageMap[i].x, imageMap[i].y, image.width, image.height,
            // imageMap[i].x, imageMap[i].y, 90, 90
            // 0, 0, image.width*2, image.height*2
        )
    });
    const blob = await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob)))
    const form = new FormData();
    form.append('file', blob)
    return await Api.upload(form)
}