/**
 * Image Converter Core Engine
 * @description メイン変換エンジン - フォーマット変換の中核機能
 * @version 1.0.0
 * @author negi-lab.com
 */

// 状態管理
// 注意: UIから直接参照・変更されるため、window公開時に参照が保たれるよう
// プリミティブではなくオブジェクトプロパティとして公開します。
const state = {
    selectedFiles: [],
    currentRotation: 0,
    currentFilter: 'none',
    results: []
};

// フォーマット変換ユーティリティ
const FormatConverter = {
    // Canvas to various formats
    canvasToBlob: function(canvas, format, quality) {
        return new Promise((resolve, reject) => {
            try {
                switch(format) {
                    case 'image/jpeg':
                    case 'image/png':
                    case 'image/webp':
                        canvas.toBlob(resolve, format, quality);
                        break;
                    case 'image/bmp':
                        this.canvasToBMP(canvas).then(resolve).catch(reject);
                        break;
                    case 'image/tiff':
                        this.canvasToTIFF(canvas, quality).then(resolve).catch(reject);
                        break;
                    case 'application/ktx':
                        this.canvasToKTX(canvas, quality).then(resolve).catch(reject);
                        break;
                    case 'application/ktx2':
                        this.canvasToKTX2(canvas, quality).then(resolve).catch(reject);
                        break;
                    case 'image/x-targa':
                        this.canvasToTGA(canvas, quality).then(resolve).catch(reject);
                        break;
                    case 'image/vnd-ms.dds':
                        this.canvasToDDS(canvas, quality).then(resolve).catch(reject);
                        break;
                    default:
                        reject(new Error('Unsupported format: ' + format));
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    // BMP変換
    canvasToBMP: function(canvas) {
        return new Promise((resolve) => {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const bmpData = this.createBMPFromImageData(imageData);
            const blob = new Blob([bmpData], { type: 'image/bmp' });
            resolve(blob);
        });
    },

    createBMPFromImageData: function(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const fileHeaderSize = 14;
        const infoHeaderSize = 40;
        const pixelDataSize = width * height * 4;
        const fileSize = fileHeaderSize + infoHeaderSize + pixelDataSize;
        
        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);
        const uint8View = new Uint8Array(buffer);
        
        // File Header
        view.setUint16(0, 0x4D42, true); // "BM"
        view.setUint32(2, fileSize, true);
        view.setUint32(6, 0, true);
        view.setUint32(10, fileHeaderSize + infoHeaderSize, true);
        
        // Info Header  
        view.setUint32(14, infoHeaderSize, true);
        view.setUint32(18, width, true);
        view.setUint32(22, -height, true); // negative for top-down
        view.setUint16(26, 1, true);
        view.setUint16(28, 32, true);
        view.setUint32(30, 0, true);
        view.setUint32(34, pixelDataSize, true);
        view.setUint32(38, 2835, true);
        view.setUint32(42, 2835, true);
        view.setUint32(46, 0, true);
        view.setUint32(50, 0, true);
        
        // Pixel Data (BGRA format)
        let offset = fileHeaderSize + infoHeaderSize;
        for (let i = 0; i < data.length; i += 4) {
            uint8View[offset++] = data[i + 2]; // B
            uint8View[offset++] = data[i + 1]; // G
            uint8View[offset++] = data[i];     // R
            uint8View[offset++] = data[i + 3]; // A
        }
        
        return buffer;
    },

    // TIFF変換
    canvasToTIFF: function(canvas, quality) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof UTIF !== 'undefined' && !window.UTIF_FALLBACK) {
                    // UTIFライブラリを使用
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    const ifd = {
                        't256': [canvas.width],
                        't257': [canvas.height], 
                        't258': [8, 8, 8, 8],
                        't259': [1],
                        't262': [2],
                        't273': [1000],
                        't277': [4],
                        't278': [canvas.height],
                        't279': [imageData.data.length],
                        't282': [[72, 1]],
                        't283': [[72, 1]],
                        't284': [1],
                        't296': [2],
                        't338': [1]
                    };
                    
                    try {
                        const tiffData = UTIF.encode([ifd], [imageData.data]);
                        const blob = new Blob([tiffData], { type: 'image/tiff' });
                        resolve(blob);
                    } catch (utifError) {
                        console.warn('UTIF encoding failed, using fallback:', utifError);
                        const ctx = canvas.getContext('2d');
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const tiffData = this.createSimpleTIFF(imageData);
                        const blob = new Blob([tiffData], { type: 'image/tiff' });
                        resolve(blob);
                    }
                } else {
                    // フォールバック実装
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const tiffData = this.createSimpleTIFF(imageData);
                    const blob = new Blob([tiffData], { type: 'image/tiff' });
                    resolve(blob);
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    createSimpleTIFF: function(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const headerSize = 8;
        const ifdSize = 2 + (14 * 12) + 4;
        const imageDataOffset = headerSize + ifdSize;
        const fileSize = imageDataOffset + data.length;
        
        const buffer = new ArrayBuffer(fileSize);
        const view = new DataView(buffer);
        const uint8View = new Uint8Array(buffer);
        
        // TIFF Header
        view.setUint16(0, 0x4949, true);    // Little endian
        view.setUint16(2, 42, true);        // Magic number
        view.setUint32(4, headerSize, true); // IFD offset
        
        // IFD (Image File Directory)
        let offset = headerSize;
        
        // Number of directory entries
        view.setUint16(offset, 14, true);
        offset += 2;
        
        // IFD entries (12 bytes each)
        const writeIFDEntry = (tag, type, count, value) => {
            view.setUint16(offset, tag, true);     // Tag
            view.setUint16(offset + 2, type, true); // Type
            view.setUint32(offset + 4, count, true); // Count
            view.setUint32(offset + 8, value, true); // Value/Offset
            offset += 12;
        };
        
        writeIFDEntry(256, 4, 1, width);          // ImageWidth
        writeIFDEntry(257, 4, 1, height);         // ImageLength
        writeIFDEntry(258, 3, 4, 0);              // BitsPerSample (8,8,8,8)
        writeIFDEntry(259, 3, 1, 1);              // Compression (none)
        writeIFDEntry(262, 3, 1, 2);              // PhotometricInterpretation (RGB)
        writeIFDEntry(273, 4, 1, imageDataOffset); // StripOffsets
        writeIFDEntry(277, 3, 1, 4);              // SamplesPerPixel (RGBA)
        writeIFDEntry(278, 4, 1, height);         // RowsPerStrip
        writeIFDEntry(279, 4, 1, data.length);    // StripByteCounts
        writeIFDEntry(282, 5, 1, 0);              // XResolution
        writeIFDEntry(283, 5, 1, 0);              // YResolution
        writeIFDEntry(284, 3, 1, 1);              // PlanarConfiguration
        writeIFDEntry(296, 3, 1, 2);              // ResolutionUnit
        writeIFDEntry(338, 3, 1, 1);              // ExtraSamples (alpha)
        
        // Next IFD offset (0 = no more IFDs)
        view.setUint32(offset, 0, true);
        
        // Copy image data
        uint8View.set(data, imageDataOffset);
        
        return buffer;
    }
};

// Export for use in other modules
window.ImageConverterCore = {
    FormatConverter,
    get selectedFiles() { return state.selectedFiles; },
    set selectedFiles(v) { state.selectedFiles = v; },
    get currentRotation() { return state.currentRotation; },
    set currentRotation(v) { state.currentRotation = v; },
    get currentFilter() { return state.currentFilter; },
    set currentFilter(v) { state.currentFilter = v; },
    get results() { return state.results; },
    set results(v) { state.results = v; }
};
