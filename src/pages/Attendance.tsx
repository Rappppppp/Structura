import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CameraPreview } from "@/components/projects/CameraPreview";
import { AttendanceForm } from "@/components/projects/AttendanceForm";
import { AttendanceHistory } from "@/components/projects/AttendanceHistory";
import { useAttendanceStore } from "@/stores/attendance.store";
import { useIsMobile } from "@/hooks/use-mobile";

const Attendance = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { setCapturedPhoto: setStoredPhoto } = useAttendanceStore();

  const handleCapture = (photoData: string) => {
    setCapturedPhoto(photoData);
    setStoredPhoto(photoData);
    setShowCamera(false);
  };

  const handleOpenCamera = () => {
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6 min-h-screen bg-background">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Check in and out with photo verification</p>
        </div>

        {/* Main Container */}
        {isMobile ? (
          // Mobile: Stacked layout
          <div className="flex flex-col gap-4">
            {/* Camera Preview Card */}
            {showCamera && (
              <Card className="p-4">
                <CameraPreview
                  onCapture={handleCapture}
                  onClose={() => setShowCamera(false)}
                  isLoading={false}
                />
              </Card>
            )}

            {/* Captured Photo Preview */}
            {capturedPhoto && !showCamera && (
              <Card className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-2">Captured Photo</p>
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full h-auto rounded-lg border-2 border-success"
                    />
                  </div>
                  <button
                    onClick={handleOpenCamera}
                    className="w-full text-sm font-semibold text-primary hover:text-primary/80 py-2"
                  >
                    Retake Photo
                  </button>
                </div>
              </Card>
            )}

            {/* Form */}
            <AttendanceForm
              capturedPhoto={capturedPhoto}
              onCaptureTrigger={handleOpenCamera}
              onSuccess={() => setCapturedPhoto(null)}
            />

            {/* History */}
            <AttendanceHistory />
          </div>
        ) : (
          // Desktop: Split layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Camera + Form */}
            <div className="lg:col-span-1 space-y-4">
              {/* Camera Card */}
              {showCamera && (
                <Card className="p-4">
                  <CameraPreview
                    onCapture={handleCapture}
                    onClose={() => setShowCamera(false)}
                    isLoading={false}
                  />
                </Card>
              )}

              {/* Captured Photo Preview */}
              {capturedPhoto && !showCamera && (
                <Card className="p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-2">Captured Photo</p>
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full h-auto rounded-lg border-2 border-success"
                    />
                  </div>
                  <button
                    onClick={handleOpenCamera}
                    className="w-full text-sm font-semibold text-primary hover:text-primary/80 py-2"
                  >
                    Retake Photo
                  </button>
                </Card>
              )}

              {/* Form */}
              <AttendanceForm
                capturedPhoto={capturedPhoto}
                onCaptureTrigger={handleOpenCamera}
                onSuccess={() => setCapturedPhoto(null)}
              />
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-2">
              <AttendanceHistory />
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal for Mobile/Tablet explicit modal */}
      <Dialog open={showCamera && isMobile} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-2xl w-screen max-h-screen sm:w-full sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Camera</DialogTitle>
          </DialogHeader>
          <CameraPreview
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Attendance;
