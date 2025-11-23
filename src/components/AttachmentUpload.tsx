import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Upload, X, File, Image, FileText, Eye, Download } from 'lucide-react';
import { AttachmentFile } from '../App';
import { ALLOWED_FILE_TYPES, MAX_FILES_PER_COMPLAINT, MAX_TOTAL_FILE_SIZE } from '../utils/constants';

interface AttachmentUploadProps {
  attachments: AttachmentFile[];
  onAttachmentsChange: (attachments: AttachmentFile[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function AttachmentUpload({ 
  attachments, 
  onAttachmentsChange, 
  maxFiles = MAX_FILES_PER_COMPLAINT,
  disabled = false 
}: AttachmentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />;
    if (type.includes('word')) return <FileText className="h-4 w-4 text-blue-500" />;
    return <File className="h-4 w-4" />;
  };

  const validateFile = (file: File): string | null => {
    const fileType = file.type;
    const fileSize = file.size;

    if (!ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES]) {
      return `File type ${fileType} is not allowed. Please use: ${Object.values(ALLOWED_FILE_TYPES).flatMap(t => t.extensions).join(', ')}`;
    }

    const maxSize = ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES].maxSize;
    if (fileSize > maxSize) {
      return `File size (${formatFileSize(fileSize)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`;
    }

    const totalCurrentSize = attachments.reduce((sum, att) => sum + att.size, 0);
    if (totalCurrentSize + fileSize > MAX_TOTAL_FILE_SIZE) {
      return `Total file size would exceed limit (${formatFileSize(MAX_TOTAL_FILE_SIZE)})`;
    }

    return null;
  };

  const handleFiles = async (files: FileList) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    
    if (attachments.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert('File validation errors:\n' + errors.join('\n'));
    }

    // Simulate file upload with progress
    for (const file of validFiles) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create attachment object
      const newAttachment: AttachmentFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // In real app, this would be the server URL
        uploadedAt: new Date().toISOString()
      };

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add to attachments
      onAttachmentsChange([...attachments, newAttachment]);
      
      // Clear progress
      setUploadProgress(prev => {
        const { [fileId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    const attachment = attachments.find(att => att.id === id);
    if (attachment && attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
    onAttachmentsChange(attachments.filter(att => att.id !== id));
  };

  const openFilePreview = (attachment: AttachmentFile) => {
    if (attachment.type.startsWith('image/') || attachment.type === 'application/pdf') {
      window.open(attachment.url, '_blank');
    }
  };

  const downloadFile = (attachment: AttachmentFile) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSize = attachments.reduce((sum, att) => sum + att.size, 0);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-[#2F5DCE] bg-blue-50' 
            : disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${
            disabled ? 'text-gray-300' : 'text-gray-400'
          }`} />
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Label htmlFor="file-upload" className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
              <span className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                disabled 
                  ? 'text-gray-400 bg-gray-200 cursor-not-allowed' 
                  : 'text-white bg-[#2F5DCE] hover:bg-[#2548a8] cursor-pointer'
              }`}>
                Choose Files
              </span>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
                onChange={handleFileSelect}
                disabled={disabled}
                className="hidden"
              />
            </Label>
            <span className="text-sm text-gray-500 self-center">or drag and drop</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Images, PDFs, Word docs up to {formatFileSize(MAX_TOTAL_FILE_SIZE)} total
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {attachments.length}/{maxFiles} files • {formatFileSize(totalSize)}/{formatFileSize(MAX_TOTAL_FILE_SIZE)} used
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Files ({attachments.length}):</Label>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <Card key={attachment.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(attachment.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {(attachment.type.startsWith('image/') || attachment.type === 'application/pdf') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openFilePreview(attachment)}
                          title="Preview file"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(attachment)}
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {!disabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(attachment.id)}
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}