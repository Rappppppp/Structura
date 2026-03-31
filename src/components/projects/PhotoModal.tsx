import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl?: string;
  caption?: string;
}

export const PhotoModal = ({ isOpen, onClose, photoUrl, caption }: PhotoModalProps) => {
  if (!photoUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto p-2 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between gap-4">
          <DialogTitle>{caption || "Attendance Photo"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex justify-center items-center">
          <img
            src={photoUrl}
            alt="Attendance"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
