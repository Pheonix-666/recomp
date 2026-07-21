export function imageDataToBMP(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const extraBytes = (4 - (width * 3) % 4) % 4;
  const rgbSize = (width * 3 + extraBytes) * height;
  const headerSize = 54;
  const fileSize = headerSize + rgbSize;
  
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  
  // File Header
  view.setUint16(0, 0x4D42, true); // BM
  view.setUint32(2, fileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, headerSize, true);
  
  // Info Header
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, -height, true); // negative for top-down
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true); // 24-bit
  view.setUint32(30, 0, true); // BI_RGB
  view.setUint32(34, rgbSize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);
  
  // Pixel Data
  let offset = headerSize;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIdx = (y * width + x) * 4;
      view.setUint8(offset++, data[pixelIdx + 2]); // B
      view.setUint8(offset++, data[pixelIdx + 1]); // G
      view.setUint8(offset++, data[pixelIdx]);     // R
    }
    for (let i = 0; i < extraBytes; i++) {
      view.setUint8(offset++, 0);
    }
  }
  return new Blob([buffer], { type: 'image/bmp' });
}

export function recordGifToVideo(frames, width, height) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    let mimeType = 'video/mp4';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    
    const stream = canvas.captureStream(0);
    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve({ blob, mimeType });
    };
    
    mediaRecorder.start();
    
    let frameIdx = 0;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    const drawNextFrame = () => {
      if (frameIdx >= frames.length) {
        setTimeout(() => {
          mediaRecorder.stop();
        }, 100);
        return;
      }
      
      const frame = frames[frameIdx];
      const patchData = new ImageData(frame.patch, frame.dims.width, frame.dims.height);
      const patchCanvas = document.createElement('canvas');
      patchCanvas.width = frame.dims.width;
      patchCanvas.height = frame.dims.height;
      const patchCtx = patchCanvas.getContext('2d');
      if (patchCtx) {
        patchCtx.putImageData(patchData, 0, 0);
      }
      
      if (frame.disposalType === 2) {
        tempCtx.clearRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height);
      }
      
      tempCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
      
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(tempCanvas, 0, 0);
      
      const track = stream.getVideoTracks()[0];
      if (track && typeof track.requestFrame === 'function') {
        track.requestFrame();
      }
      
      frameIdx++;
      setTimeout(drawNextFrame, frame.delay || 100);
    };
    
    drawNextFrame();
  });
}

export const formatSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
