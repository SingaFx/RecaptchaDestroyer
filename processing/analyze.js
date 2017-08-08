var PNG = require('png-js');

const googleBlue = {
  r: 74,
  g: 144,
  b: 226
}

function extractImages(imageBuffer) {
  return new Promise((resolve, reject) => {
    const png = new PNG(imageBuffer);
    png.decode((pixels) => {
      console.log('pixels: ', pixels[0]);
      const nicePixels = pixels.reduce((arr, pix, i) => {
        const ndx = Math.floor(i/4);
        if(arr[ndx] === undefined) {
          arr[ndx] = {}
        }
        switch(i % 4) {
          case 0:
            arr[ndx].r = pix;
            break;
          case 1:
            arr[ndx].g = pix;
            break;
          case 2:
            arr[ndx].b = pix;
            break;
          case 3:
            arr[ndx].a = pix;
            break;
        }
        return arr;
      }, []);
      resolve(nicePixels);
    });
  });
}

var fs = require('fs');
var data = fs.readFileSync('./testimgs/after.png');
extractImages(data).then((pixels) => {
  console.log('nicePixels: ', pixels);
});