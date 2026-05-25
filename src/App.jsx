import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import { Image as ImageIcon, FileText, Upload, Download, Settings2, Trash2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'pdf'
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Settings
  const [imageQuality, setImageQuality] = useState(0.8);
  
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCompressedFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Basic validation based on active tab
      if (activeTab === 'image' && !droppedFile.type.startsWith('image/')) {
        alert('Please drop an image file');
        return;
      }
      if (activeTab === 'pdf' && droppedFile.type !== 'application/pdf') {
        alert('Please drop a PDF file');
        return;
      }
      
      setFile(droppedFile);
      setCompressedFile(null);
    }
  };

  const resetFile = () => {
    setFile(null);
    setCompressedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressImage = async () => {
    if (!file) return;
    setIsCompressing(true);
    setProgress(10);
    
    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: imageQuality,
        onProgress: (p) => setProgress(p),
      };
      
      const compressedBlob = await imageCompression(file, options);
      setCompressedFile(compressedBlob);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image.');
    } finally {
      setIsCompressing(false);
      setProgress(100);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsCompressing(true);
    setProgress(30);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(60);
      
      // Saving effectively rebuilds the PDF and can reduce size by removing unused objects
      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      setProgress(90);
      
      const compressedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setCompressedFile(compressedBlob);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('Failed to compress PDF.');
    } finally {
      setIsCompressing(false);
      setProgress(100);
    }
  };

  const downloadFile = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
            HyperCompress
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">
            Fast, client-side compression for your images and PDFs. Your files never leave your device.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl shadow-xl overflow-hidden border border-[var(--color-border)]">
          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border)]">
            <button
              onClick={() => { setActiveTab('image'); resetFile(); }}
              className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'image'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Image Compressor
            </button>
            <button
              onClick={() => { setActiveTab('pdf'); resetFile(); }}
              className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'pdf'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              PDF Compressor
            </button>
          </div>

          <div className="p-8">
            {/* Upload Zone */}
            {!file ? (
              <div
                className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-[var(--color-surface-hover)] transition-all"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={activeTab === 'image' ? 'image/*' : 'application/pdf'}
                />
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & drop your file here</h3>
                <p className="text-[var(--color-text-muted)]">
                  or click to browse from your device
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-4">
                  Supports {activeTab === 'image' ? 'JPG, PNG, WebP' : 'PDF files'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-[var(--color-surface-hover)] rounded-lg border border-[var(--color-border)]">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                      {activeTab === 'image' ? <ImageIcon /> : <FileText />}
                    </div>
                    <div className="truncate">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={resetFile}
                    className="p-2 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Settings (Only for Image) */}
                {activeTab === 'image' && !compressedFile && (
                  <div className="p-4 border border-[var(--color-border)] rounded-lg">
                    <div className="flex items-center mb-4">
                      <Settings2 className="w-5 h-5 mr-2 text-purple-500" />
                      <h3 className="font-medium">Compression Settings</h3>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm text-[var(--color-text-muted)]">Quality</label>
                        <span className="text-sm font-medium">{Math.round(imageQuality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={imageQuality}
                        onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* Progress / Status */}
                {isCompressing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-purple-600 dark:text-purple-400">Compressing...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Result */}
                {compressedFile && (
                  <div className="p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="text-green-800 dark:text-green-400 font-semibold mb-4 text-center">Compression Complete!</h3>
                    <div className="flex justify-around text-center mb-6">
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Original</p>
                        <p className="font-semibold">{formatSize(file.size)}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-green-500 font-bold text-lg">→</span>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Compressed</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">{formatSize(compressedFile.size)}</p>
                      </div>
                    </div>
                    <div className="text-center mb-6">
                      <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                        Saved {formatSize(file.size - compressedFile.size)} ({Math.round(((file.size - compressedFile.size) / file.size) * 100)}%)
                      </span>
                    </div>
                    <button
                      onClick={downloadFile}
                      className="w-full flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download File
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                {!compressedFile && !isCompressing && (
                  <button
                    onClick={activeTab === 'image' ? compressImage : compressPdf}
                    className="w-full flex items-center justify-center py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                  >
                    Compress {activeTab === 'image' ? 'Image' : 'PDF'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
