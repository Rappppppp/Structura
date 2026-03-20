import { useCamera } from "@/hooks/useCamera";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraPreviewProps {
  onCapture: (photoData: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const CameraPreview = ({ onCapture, onClose, isLoading }: CameraPreviewProps) => {
  const { videoRef, canvasRef, error, isLoading: cameraLoading, capturePhoto, switchCamera, facingMode } = useCamera();

  const handleCapture = () => {
    const photoData = capturePhoto();
    if (photoData) {
      onCapture(photoData);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Camera Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Camera Loading State */}
      {(cameraLoading || isLoading) && (
        <div className="flex items-center justify-center aspect-video bg-muted rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Video Stream */}
      {!error && (
        <div className="flex flex-col gap-3">
          <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              onClick={handleCapture}
              disabled={isLoading || cameraLoading}
              className="flex-1 bg-success hover:bg-success/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Capture Photo
            </Button>

            <Button
              onClick={switchCamera}
              variant="outline"
              disabled={isLoading || cameraLoading}
              className="flex-1 sm:flex-none"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Switch Camera
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Currently using {facingMode === 'user' ? 'front' : 'rear'} camera
          </p>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
