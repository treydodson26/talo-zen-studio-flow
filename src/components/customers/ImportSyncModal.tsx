import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ImportSyncModal({ isOpen, onClose, onImportComplete }: ImportSyncModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    stats?: {
      totalProcessed: number;
      newClients: number;
      updatedClients: number;
      errors: number;
    };
  } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setResults(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResults(null);

    try {
      // Upload file to Supabase storage
      const fileName = `arketa-import-${Date.now()}.csv`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imports')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      setProgress(25);

      // Call the edge function to process the CSV
      const { data, error } = await supabase.functions.invoke('process-arketa-csv', {
        body: { fileName }
      });

      if (error) {
        throw new Error(`Processing failed: ${error.message}`);
      }

      setProgress(100);
      setResults({
        success: true,
        message: 'Import completed successfully!',
        stats: data.stats
      });

      toast({
        title: "Import successful",
        description: `Processed ${data.stats.totalProcessed} records`,
      });

      onImportComplete();
    } catch (error) {
      console.error('Import error:', error);
      setResults({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed'
      });

      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      setResults(null);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import & Sync Arketa Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Select Arketa CSV Export</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground">
              Upload the daily CSV export from Arketa to sync client data
            </p>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {results && (
            <Alert variant={results.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {results.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <AlertDescription>
                  {results.message}
                  {results.stats && (
                    <div className="mt-2 text-sm space-y-1">
                      <div>Total processed: {results.stats.totalProcessed}</div>
                      <div>New clients: {results.stats.newClients}</div>
                      <div>Updated clients: {results.stats.updatedClients}</div>
                      {results.stats.errors > 0 && (
                        <div className="text-destructive">Errors: {results.stats.errors}</div>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              {results?.success ? 'Close' : 'Cancel'}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? 'Processing...' : 'Import & Sync'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}