/**
 * Image Converter Format Handlers
 * @description 特殊フォーマット（TGA, KTX, KTX2, DDS等）の変換処理
 * @version 1.0.0
 * @author negi-lab.com
 */

// フォーマット固有の変換機能を拡張
window.ImageConverterCore.FormatConverter = {
    ...window.ImageConverterCore.FormatConverter,

    // TGA変換
    canvasToTGA: function(canvas, quality) {
        return new Promise((resolve) => {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const tgaData = this.createTGAFromImageData(imageData);
            const blob = new Blob([tgaData], { type: 'image/x-targa' });
            resolve(blob);
        });
    },

    createTGAFromImageData: function(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const headerSize = 18;
        const pixelDataSize = width * height * 4;
        const fileSize = headerSize + pixelDataSize;
        
        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);
        const uint8View = new Uint8Array(buffer);
        
        // TGA Header
        view.setUint8(0, 0);          // ID Length
        view.setUint8(1, 0);          // Color Map Type
        view.setUint8(2, 2);          // Image Type (Uncompressed True Color)
        view.setUint16(3, 0, true);   // Color Map First Entry Index
        view.setUint16(5, 0, true);   // Color Map Length
        view.setUint8(7, 0);          // Color Map Entry Size
        view.setUint16(8, 0, true);   // X Origin
        view.setUint16(10, 0, true);  // Y Origin
        view.setUint16(12, width, true);  // Width
        view.setUint16(14, height, true); // Height
        view.setUint8(16, 32);        // Pixel Depth (32 bits BGRA)
        view.setUint8(17, 8);         // Image Descriptor (origin top-left, 8 alpha bits)
        
        // Pixel Data (BGRA format, bottom-up)
        let offset = headerSize;
        for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                uint8View[offset++] = data[pixelIndex + 2]; // B
                uint8View[offset++] = data[pixelIndex + 1]; // G
                uint8View[offset++] = data[pixelIndex];     // R
                uint8View[offset++] = data[pixelIndex + 3]; // A
            }
        }
        
        return buffer;
    },

    // KTX変換 (簡易実装)
    canvasToKTX: function(canvas, quality) {
        return new Promise((resolve) => {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const ktxData = this.createKTXFromImageData(imageData);
            const blob = new Blob([ktxData], { type: 'image/ktx' });
            resolve(blob);
        });
    },

    createKTXFromImageData: function(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // KTX identifier
        const identifier = new Uint8Array([0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A]);
        
        const headerSize = 64;
        const pixelDataSize = data.length;
        const fileSize = identifier.length + headerSize + 4 + pixelDataSize;
        
        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);
        const uint8View = new Uint8Array(buffer);
        
        let offset = 0;
        
        // KTX identifier
        uint8View.set(identifier, offset);
        offset += identifier.length;
        
        // KTX header
        view.setUint32(offset, 0x04030201, true);      // endianness
        view.setUint32(offset + 4, 0x1908, true);      // glType (GL_RGBA)
        view.setUint32(offset + 8, 1, true);           // glTypeSize
        view.setUint32(offset + 12, 0x1908, true);     // glFormat (GL_RGBA)
        view.setUint32(offset + 16, 0x8058, true);     // glInternalFormat (GL_RGBA8)
        view.setUint32(offset + 20, 0x1908, true);     // glBaseInternalFormat (GL_RGBA)
        view.setUint32(offset + 24, width, true);      // pixelWidth
        view.setUint32(offset + 28, height, true);     // pixelHeight
        view.setUint32(offset + 32, 0, true);          // pixelDepth
        view.setUint32(offset + 36, 0, true);          // numberOfArrayElements
        view.setUint32(offset + 40, 1, true);          // numberOfFaces
        view.setUint32(offset + 44, 1, true);          // numberOfMipmapLevels
        view.setUint32(offset + 48, 0, true);          // bytesOfKeyValueData
        
        offset += headerSize;
        
        // Image size
        view.setUint32(offset, pixelDataSize, true);
        offset += 4;
        
        // Image data
        uint8View.set(data, offset);
        
        return buffer;
    },

    // KTX2変換 (簡易実装)
    canvasToKTX2: function(canvas, quality) {
        return new Promise((resolve) => {
            // KTX2は複雑なので、今回はKTX形式で代替
            this.canvasToKTX(canvas, quality).then(resolve);
        });
    },

    // DDS変換 (簡易実装)
    canvasToDDS: function(canvas, quality) {
        return new Promise((resolve) => {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const ddsData = this.createDDSFromImageData(imageData);
            const blob = new Blob([ddsData], { type: 'image/dds' });
            resolve(blob);
        });
    },

    createDDSFromImageData: function(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const headerSize = 128;
        const pixelDataSize = data.length;
        const fileSize = headerSize + pixelDataSize;
        
        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);
        const uint8View = new Uint8Array(buffer);
        
        // DDS header
        view.setUint32(0, 0x20534444, true);          // "DDS "
        view.setUint32(4, 124, true);                 // dwSize
        view.setUint32(8, 0x1007, true);              // dwFlags
        view.setUint32(12, height, true);             // dwHeight
        view.setUint32(16, width, true);              // dwWidth
        view.setUint32(20, pixelDataSize, true);      // dwPitchOrLinearSize
        view.setUint32(24, 0, true);                  // dwDepth
        view.setUint32(28, 1, true);                  // dwMipMapCount
        
        // dwReserved1 (11 DWORDs)
        for (let i = 0; i < 11; i++) {
            view.setUint32(32 + i * 4, 0, true);
        }
        
        // DDS_PIXELFORMAT
        view.setUint32(76, 32, true);                 // dwSize
        view.setUint32(80, 0x41, true);               // dwFlags (DDPF_RGB | DDPF_ALPHAPIXELS)
        view.setUint32(84, 0, true);                  // dwFourCC
        view.setUint32(88, 32, true);                 // dwRGBBitCount
        view.setUint32(92, 0x00FF0000, true);         // dwRBitMask
        view.setUint32(96, 0x0000FF00, true);         // dwGBitMask
        view.setUint32(100, 0x000000FF, true);        // dwBBitMask
        view.setUint32(104, 0xFF000000, true);        // dwABitMask
        
        view.setUint32(108, 0x1000, true);            // dwCaps
        view.setUint32(112, 0, true);                 // dwCaps2
        view.setUint32(116, 0, true);                 // dwCaps3
        view.setUint32(120, 0, true);                 // dwCaps4
        view.setUint32(124, 0, true);                 // dwReserved2
        
        // Pixel data
        uint8View.set(data, headerSize);
        
        return buffer;
    },

    // HDR変換 (基本実装)
    canvasToHDR: function(canvas, quality) {
        return new Promise((resolve) => {
            // HDRは複雑なので、今回は通常のPNG形式で代替
            canvas.toBlob(resolve, 'image/png', quality || 0.9);
        });
    },

    // EXR変換 (基本実装)  
    canvasToEXR: function(canvas, quality) {
        return new Promise((resolve) => {
            // EXRは複雑なので、今回は通常のPNG形式で代替
            canvas.toBlob(resolve, 'image/png', quality || 0.9);
        });
    }
};
