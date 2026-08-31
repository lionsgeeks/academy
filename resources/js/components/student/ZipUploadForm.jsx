import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileArchive, Trash2 } from 'lucide-react';

export default function ZipUploadForm({ formData, setFormData, maxSize = 50 }) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const validateFile = (file) => {
        // Check file type
        if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed' && !file.name.endsWith('.zip')) {
            return {
                valid: false,
                error: 'Please upload a ZIP file (.zip)'
            };
        }

        // Check file size (in MB)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            return {
                valid: false,
                error: `File size must be less than ${maxSize}MB (current: ${fileSizeMB.toFixed(2)}MB)`
            };
        }

        return { valid: true };
    };

    const handleFile = (file) => {
        const validation = validateFile(file);
        setUploadError(null);

        if (!validation.valid) {
            setUploadError(validation.error);
            return;
        }

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 30;
            });
        }, 300);

        // Read file as base64 (or store file object)
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadProgress(100);
            clearInterval(interval);
            
            setFormData({
                ...formData,
                zip_file: file,
                zip_file_name: file.name,
                zip_file_size: file.size
            });
            
            setTimeout(() => setUploadProgress(0), 1000);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                    dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
            >
                <input
                    type="file"
                    accept=".zip,application/zip,application/x-zip-compressed"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center">
                    <FileArchive className={`w-12 h-12 mx-auto mb-3 ${
                        dragActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Drop your ZIP file here
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                        Maximum file size: {maxSize}MB
                    </p>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-blue-600 mt-2 text-center font-medium">
                            Uploading... {Math.round(uploadProgress)}%
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-900">Upload Error</h4>
                        <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                </div>
            )}

            {/* File Info */}
            {formData.zip_file && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-green-900">File Ready</h4>
                                <div className="text-sm text-green-700 mt-1 space-y-0.5">
                                    <p>📄 {formData.zip_file_name}</p>
                                    <p>📊 {(formData.zip_file_size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    zip_file: null,
                                    zip_file_name: null,
                                    zip_file_size: null
                                });
                                setUploadError(null);
                            }}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Help */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📦 ZIP Requirements</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Maximum size: {maxSize}MB</li>
                    <li>✓ Must be in valid ZIP format</li>
                    <li>✓ Structure your files clearly (use directories)</li>
                    <li>✓ Include a README explaining what's in each file</li>
                </ul>
            </div>
        </div>
    );
}
