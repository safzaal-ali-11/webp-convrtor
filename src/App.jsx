import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { 
  Download, 
  Trash2, 
  Zap, 
  CheckCircle2,
  Plus,
  Image as ImageIcon,
  MoveVertical,
  Move,
  User
} from 'lucide-react';
import { convertImageToWebP, formatBytes } from './utils/webpConverter';
import CropModal from './components/CropModal';
import AboutPage from './components/AboutPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' | 'about'
  const [files, setFiles] = useState([]);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);

  // Settings state
  const [keyword, setKeyword] = useState('keyword');
  const [quality, setQuality] = useState(85);
  const [separator, setSeparator] = useState('-');
  const [padding, setPadding] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [aspectRatio169, setAspectRatio169] = useState(true);
  const [googleDiscoverPreset, setGoogleDiscoverPreset] = useState(true);
  const [targetSeoSize, setTargetSeoSize] = useState(true);

  const fileInputRef = useRef(null);

  // Re-run conversion when settings or files change
  useEffect(() => {
    if (files.length === 0) {
      setConvertedImages([]);
      return;
    }

    const processFiles = async () => {
      setIsProcessing(true);
      try {
        // Maintain exact user upload order (insertion order)
        const results = [];

        for (let i = 0; i < files.length; i++) {
          const fileItem = files[i];
          const seqIndex = Number(startIndex) + i;

          const res = await convertImageToWebP(fileItem.file, {
            keyword: keyword.trim() || 'keyword',
            sequenceIndex: seqIndex,
            padding: Number(padding),
            separator: separator,
            quality: Number(quality),
            aspectRatio169: aspectRatio169,
            googleDiscoverPreset: googleDiscoverPreset,
            targetSeoSize: targetSeoSize,
            cropPositionY: fileItem.cropY ?? 50,
            cropPositionX: fileItem.cropX ?? 50
          });

          results.push({
            ...res,
            id: fileItem.id,
            cropY: fileItem.cropY ?? 50,
            cropX: fileItem.cropX ?? 50
          });
        }

        setConvertedImages(results);
      } catch (err) {
        console.error("Conversion error:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    processFiles();
  }, [files, keyword, quality, separator, padding, startIndex, aspectRatio169, googleDiscoverPreset, targetSeoSize]);

  // Handle single picture upload
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      const newItems = selected.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        cropY: 50, // default center
        cropX: 50
      }));
      setFiles((prev) => [...prev, ...newItems]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update crop position for a specific image
  const handleUpdateCropY = (id, newCropY) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cropY: newCropY } : item))
    );
  };

  const handleSaveCropPosition = (id, newCropY, newCropX) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cropY: newCropY, cropX: newCropX } : item))
    );
  };

  const handleOpenCropModal = (item) => {
    setActiveModalItem(item);
  };

  const handleRemoveItem = (id) => {
    setConvertedImages((prev) => prev.filter((item) => item.id !== id));
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
    setConvertedImages([]);
  };

  // Download single image
  const handleDownloadSingle = (item) => {
    const a = document.createElement('a');
    a.href = item.webpUrl;
    a.download = item.webpName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download all as ZIP archive
  const handleDownloadZip = async () => {
    if (convertedImages.length === 0) return;
    const zip = new JSZip();

    convertedImages.forEach((img) => {
      zip.file(img.webpName, img.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = `${keyword.trim() || 'webp-images'}-bundle.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Statistics calculation
  const totalOrigBytes = convertedImages.reduce((sum, item) => sum + item.originalSize, 0);
  const totalWebpBytes = convertedImages.reduce((sum, item) => sum + item.webpSize, 0);
  const totalSavedBytes = Math.max(0, totalOrigBytes - totalWebpBytes);
  const overallSavingsPct = totalOrigBytes > 0 ? ((totalSavedBytes / totalOrigBytes) * 100).toFixed(1) : 0;

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo">
              <Zap size={22} className="logo-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">PhotoWebP</span>
              <span className="brand-tag">SEO Suite</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs" aria-label="Main Navigation">
            <button
              className={`nav-tab-btn ${activeTab === 'converter' ? 'active' : ''}`}
              onClick={() => setActiveTab('converter')}
            >
              <Zap size={16} />
              <span>Converter</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <User size={16} />
              <span>About Me</span>
            </button>
          </nav>

          {/* Converter Controls in Navbar (shown when converter tab active) */}
          {activeTab === 'converter' && (
            <div className="nav-controls">
              {/* Target Keyword Input in Navbar */}
              <div className="nav-keyword-group">
                <span className="nav-keyword-label">Keyword:</span>
                <input
                  type="text"
                  className="nav-keyword-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. keyword"
                />
              </div>

              {/* Quality Slider in Navbar */}
              <div className="nav-quality-group">
                <span className="nav-quality-label">Quality ({quality}%):</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  className="nav-quality-slider"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                />
              </div>

              {/* Hidden Single File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple={false}
                accept="image/*,.heic,.heif,.avif,.webp,.svg,.bmp,.tiff"
                style={{ display: 'none' }}
              />

              {/* Upload Picture Button in Navbar */}
              <button 
                className="btn btn-upload-nav" 
                onClick={() => fileInputRef.current?.click()}
                title="Upload picture one by one"
              >
                <Plus size={18} />
                <span>Upload Picture</span>
              </button>

              {/* Zip Download Button */}
              {convertedImages.length > 0 && (
                <button className="btn btn-primary nav-btn-compact" onClick={handleDownloadZip} title="Download All as ZIP">
                  <Download size={16} />
                  <span>Download ZIP</span>
                </button>
              )}

              {/* Clear All Button */}
              {convertedImages.length > 0 && (
                <button className="btn btn-danger nav-btn-compact" onClick={handleClearAll} title="Clear All">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="container mt-navbar">
        {/* TAB 1: CONVERTER VIEW */}
        {activeTab === 'converter' && (
          <>
            {/* Empty State when no photos uploaded */}
            {convertedImages.length === 0 && (
              <div className="empty-upload-card glass-card">
                <div className="empty-icon-wrap">
                  <ImageIcon size={48} className="empty-icon" />
                </div>
                <h3>No Pictures Uploaded Yet</h3>
                <p>Click the <strong>Upload Picture</strong> button to add your photos one by one.</p>
                <p className="empty-hint">First image will be named <code>{keyword}-1.webp</code>, second <code>{keyword}-2.webp</code>, etc.</p>
                
                <button 
                  className="btn btn-upload-main mt-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus size={20} />
                  <span>Upload Picture</span>
                </button>
              </div>
            )}

            {/* Stats Summary Bar */}
            {convertedImages.length > 0 && (
              <div className="stats-bar">
                <div className="stat-box">
                  <div className="val">{convertedImages.length}</div>
                  <div className="lbl">Total Photos</div>
                </div>
                <div className="stat-box">
                  <div className="val">{formatBytes(totalOrigBytes)}</div>
                  <div className="lbl">Original Size</div>
                </div>
                <div className="stat-box">
                  <div className="val" style={{ color: 'var(--success)' }}>{formatBytes(totalWebpBytes)}</div>
                  <div className="lbl">Converted WebP Size</div>
                </div>
                <div className="stat-box">
                  <div className="val" style={{ color: 'var(--primary-glow)' }}>{overallSavingsPct}%</div>
                  <div className="lbl">Space Saved ({formatBytes(totalSavedBytes)})</div>
                </div>
              </div>
            )}

            {/* Converted Images List Header */}
            {convertedImages.length > 0 && (
              <div className="batch-header">
                <h2>
                  Converted Files ({convertedImages.length})
                </h2>
              </div>
            )}

            {/* Converted Images List (Top to Bottom sequence) */}
            <div className="image-grid">
              {convertedImages.map((item) => {
                const isSeoGreen = item.webpSize < 100 * 1024;
                const isSeoYellow = item.webpSize >= 100 * 1024 && item.webpSize < 250 * 1024;

                return (
                  <div key={item.id} className="image-card">
                    <img src={item.webpUrl} alt={item.webpName} className="img-preview" />

                    <div className="img-info">
                      <div className="img-title">{item.webpName}</div>
                      <div className="img-sub">
                        <span>Orig: <strong>{formatBytes(item.originalSize)}</strong></span>
                        <span>➜ WebP: <strong style={{ color: 'var(--success)' }}>{formatBytes(item.webpSize)}</strong></span>
                        <span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>(-{item.savingsPercent}%)</span>
                        <span>Dimensions: <strong>{item.width}x{item.height} {aspectRatio169 ? '(16:9)' : ''}</strong></span>
                        
                        {item.webpSize >= 90 * 1024 && item.webpSize <= 95 * 1024 ? (
                          <span className="seo-badge seo-green">
                            <CheckCircle2 size={12} /> 🎯 Perfect SEO Weight (90–95 KB)
                          </span>
                        ) : isSeoGreen ? (
                          <span className="seo-badge seo-green">
                            <CheckCircle2 size={12} /> 🟢 Google PageSpeed Ready ({formatBytes(item.webpSize)})
                          </span>
                        ) : isSeoYellow ? (
                          <span className="seo-badge seo-yellow">
                            🟡 Good (&lt;250KB)
                          </span>
                        ) : (
                          <span className="seo-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                            🔴 Heavy (&gt;250KB)
                          </span>
                        )}
                      </div>

                      {/* Position Adjuster Controls */}
                      <div className="img-position-bar">
                        <span className="pos-label">
                          <MoveVertical size={13} color="var(--primary-glow)" /> Crop Position:
                        </span>
                        <div className="pos-btn-group">
                          <button
                            className={`btn-pos ${item.cropY === 0 ? 'active' : ''}`}
                            onClick={() => handleUpdateCropY(item.id, 0)}
                            title="Align crop to Top of image"
                          >
                            Top
                          </button>
                          <button
                            className={`btn-pos ${item.cropY === 50 ? 'active' : ''}`}
                            onClick={() => handleUpdateCropY(item.id, 50)}
                            title="Align crop to Center of image"
                          >
                            Center
                          </button>
                          <button
                            className={`btn-pos ${item.cropY === 100 ? 'active' : ''}`}
                            onClick={() => handleUpdateCropY(item.id, 100)}
                            title="Align crop to Bottom of image"
                          >
                            Bottom
                          </button>
                        </div>

                        <button
                          className="btn-open-modal"
                          onClick={() => handleOpenCropModal(item)}
                          title="Open popup to drag and adjust crop position visually"
                        >
                          <Move size={14} /> Drag & Adjust Popup
                        </button>
                      </div>
                    </div>

                    <div className="img-actions">
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                        onClick={() => handleDownloadSingle(item)}
                        title="Download single WebP image"
                      >
                        <Download size={16} /> WebP
                      </button>
                      <button
                        className="btn btn-secondary btn-danger"
                        style={{ padding: '0.5rem' }}
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove from list"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Picture Button ALWAYS at the Bottom of All Images */}
            {convertedImages.length > 0 && (
              <div className="add-picture-bottom-wrap">
                <button 
                  className="btn btn-upload-main btn-bottom-add" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus size={20} />
                  <span>Add Picture</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: ABOUT ME VIEW */}
        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Interactive Crop Position Popup Modal */}
      {activeModalItem && (
        <CropModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
          onSave={handleSaveCropPosition}
        />
      )}
    </div>
  );
}
