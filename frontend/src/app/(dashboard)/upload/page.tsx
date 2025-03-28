// src/app/(dashboard)/upload/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }
    
    setUploadStatus('uploading');
    
    // Simulate upload delay
    setTimeout(() => {
      // Mocking a successful upload
      setUploadStatus('success');
      setUploadedFiles([...uploadedFiles, selectedFile.name]);
      setSelectedFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Files</h1>
        <p className="text-gray-500">Upload images and data files for analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Upload New File">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">File Type</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  defaultValue="image"
                >
                  <option value="image">Image (JPG, PNG)</option>
                  <option value="csv">Data File (CSV)</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="pdf">PDF Document</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Association</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  defaultValue=""
                >
                  <option value="" disabled>Select a site</option>
                  <option value="SITE-001">Solar Farm Alpha (SITE-001)</option>
                  <option value="SITE-002">Solar Farm Beta (SITE-002)</option>
                  <option value="SITE-003">Solar Farm Gamma (SITE-003)</option>
                  <option value="SITE-004">Solar Farm Delta (SITE-004)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, CSV, XLSX up to 10MB</p>
                  </div>
                </div>
              </div>
              
              {selectedFile && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
                        <div className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-900"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <Alert variant="error" dismissible>
                  {errorMessage}
                </Alert>
              )}
              
              {uploadStatus === 'success' && (
                <Alert variant="success" dismissible>
                  File uploaded successfully! Processing will begin shortly.
                </Alert>
              )}
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-3"
                  onClick={() => {
                    setSelectedFile(null);
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                >
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Recently Uploaded Files">
            {uploadedFiles.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {uploadedFiles.map((fileName, index) => (
                  <li key={index} className="py-4 flex">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{fileName}</p>
                      <p className="text-sm text-gray-500">Uploaded just now</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
                <p className="mt-1 text-sm text-gray-500">Upload a file to start analyzing data</p>
              </div>
            )}
          </Card>
          
          <Card title="Upload Guidelines" className="mt-6">
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-900">Supported File Types</h3>
                <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1">
                  <li>Images: JPG, PNG (max 10MB)</li>
                  <li>Data Files: CSV, XLSX (max 50MB)</li>
                  <li>Documents: PDF (max 20MB)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Processing Information</h3>
                <p className="mt-2 text-gray-600">
                  Files are automatically processed after upload. Image analysis typically takes 
                  3-5 minutes, while data file analysis may take up to 10 minutes depending on size.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Best Practices</h3>
                <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1">
                  <li>Always associate files with the correct site</li>
                  <li>Use consistent naming conventions</li>
                  <li>For best thermal image results, capture during peak sunlight hours</li>
                  <li>Ensure CSV files have consistent formatting</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}