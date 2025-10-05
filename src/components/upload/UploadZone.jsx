import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { UPLOAD_CONSTRAINTS } from '@/lib/constants';
import { parsePDFToItinerary } from '@/utils/simplePdfParser';
import { useItineraryStore } from '@/hooks/useItineraries';

export function UploadZone() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  const { itineraries, addItinerary } = useItineraryStore();
  const canUploadMore = itineraries.length < UPLOAD_CONSTRAINTS.maxFiles;

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size exceeds 5MB limit');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Only PDF files are accepted');
      } else {
        setError('Invalid file');
      }
      return;
    }

    // Check if we can upload more
    if (itineraries.length >= UPLOAD_CONSTRAINTS.maxFiles) {
      setError(`Maximum ${UPLOAD_CONSTRAINTS.maxFiles} itineraries allowed`);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setCurrentFile(file.name);
    setUploading(true);
    setUploadProgress(20);

    try {
      // Parse PDF with LLM only (simple and accurate)
      setUploadProgress(30);
      const parsedData = await parsePDFToItinerary(file);

      setUploadProgress(80);

      // Add to store
      addItinerary(parsedData);

      setUploadProgress(100);

      // Reset after delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setCurrentFile(null);
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to parse PDF. Please check your API key.');
      setUploading(false);
      setUploadProgress(0);
      setCurrentFile(null);
    }
  }, [itineraries.length, addItinerary]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: UPLOAD_CONSTRAINTS.acceptedFormats,
    maxSize: UPLOAD_CONSTRAINTS.maxFileSize,
    multiple: false,
    disabled: !canUploadMore || uploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-primary bg-primary-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-primary hover:bg-slate-50'}
          ${!canUploadMore || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
            {uploading ? (
              <FileText className="w-8 h-8 animate-pulse" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          {uploading ? (
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <p className="text-sm font-medium text-slate-700">
                  AI Parsing {currentFile}...
                </p>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-slate-500">
                {uploadProgress}% • This may take 2-5 seconds
              </p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {canUploadMore ? (
                    <>Drop PDF itinerary here or click to browse</>
                  ) : (
                    <>Maximum {UPLOAD_CONSTRAINTS.maxFiles} itineraries uploaded</>
                  )}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {canUploadMore && `PDF only • Max 5MB • ${itineraries.length}/${UPLOAD_CONSTRAINTS.maxFiles} uploaded`}
                </p>
              </div>

              {canUploadMore && (
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
