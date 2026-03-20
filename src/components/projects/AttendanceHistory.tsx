import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { TablePagination } from "@/components/TablePagination";
import { useAttendanceRecords } from "@/hooks/queries/useAttendance";
import { PhotoModal } from "./PhotoModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { AttendanceRecord } from "@/types/attendance";

interface AttendanceHistoryProps {
  onPhotoClick?: (photoUrl: string, caption: string) => void;
}

export const AttendanceHistory = ({ onPhotoClick }: AttendanceHistoryProps) => {
  const { data: attendanceData, isLoading } = useAttendanceRecords();
  const isMobile = useIsMobile();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string } | null>(null);

  const handlePhotoClick = (record: AttendanceRecord, type: 'checkIn' | 'checkOut') => {
    const photoUrl = type === 'checkIn' ? record.checkInPhoto : record.checkOutPhoto;
    if (photoUrl) {
      setSelectedPhoto({
        url: photoUrl,
        caption: `${type === 'checkIn' ? 'Check-in' : 'Check-out'} - ${new Date(record.checkInTime).toLocaleString()}`,
      });
      setPhotoModalOpen(true);
      onPhotoClick?.(photoUrl, `${type === 'checkIn' ? 'Check-in' : 'Check-out'}`);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return "Ongoing";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const minutes = Math.floor((end.getTime() - start.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getScopeLabel = (scope: string, scopeName?: string) => {
    if (scope === 'global') return <Badge variant="secondary">Company</Badge>;
    if (scope === 'project') return <Badge variant="outline">Project: {scopeName || 'N/A'}</Badge>;
    if (scope === 'team') return <Badge variant="outline">Team: {scopeName || 'N/A'}</Badge>;
    return <Badge>{scope}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const records = attendanceData?.data || [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Showing {records.length} record{records.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No attendance records yet</p>
            </div>
          ) : isMobile ? (
            // Mobile: Card Layout
            <div className="space-y-3">
              {records.map((record) => (
                <Card key={record.id} className="bg-muted/30">
                  <CardContent className="pt-4 space-y-3">
                    {/* Date and Scope */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm">
                        {formatDate(record.checkInTime)}
                      </span>
                      {getScopeLabel(record.scope, record.scopeName)}
                    </div>

                    {/* Times */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Check In</div>
                        <div className="font-semibold">
                          {formatTime(record.checkInTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Check Out</div>
                        <div className="font-semibold">
                          {record.checkOutTime ? formatTime(record.checkOutTime) : 'Ongoing'}
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="text-sm">
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="font-semibold">
                        {calculateDuration(record.checkInTime, record.checkOutTime)}
                      </div>
                    </div>

                    {/* Photos */}
                    <div className="flex gap-2 pt-2">
                      {record.checkInPhoto && (
                        <Button
                          onClick={() => handlePhotoClick(record, 'checkIn')}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          In
                        </Button>
                      )}
                      {record.checkOutPhoto && (
                        <Button
                          onClick={() => handlePhotoClick(record, 'checkOut')}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Out
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Desktop: Table Layout
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Photos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {formatDate(record.checkInTime)}
                      </TableCell>
                      <TableCell>
                        {getScopeLabel(record.scope, record.scopeName)}
                      </TableCell>
                      <TableCell>{formatTime(record.checkInTime)}</TableCell>
                      <TableCell>
                        {record.checkOutTime
                          ? formatTime(record.checkOutTime)
                          : <Badge variant="secondary">Ongoing</Badge>}
                      </TableCell>
                      <TableCell className="font-medium">
                        {calculateDuration(record.checkInTime, record.checkOutTime)}
                      </TableCell>
                      <TableCell className="space-x-1">
                        {record.checkInPhoto && (
                          <Button
                            onClick={() => handlePhotoClick(record, 'checkIn')}
                            variant="ghost"
                            size="sm"
                            title="Check-in photo"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {record.checkOutPhoto && (
                          <Button
                            onClick={() => handlePhotoClick(record, 'checkOut')}
                            variant="ghost"
                            size="sm"
                            title="Check-out photo"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={photoModalOpen}
        onClose={() => {
          setPhotoModalOpen(false);
          setSelectedPhoto(null);
        }}
        photoUrl={selectedPhoto?.url}
        caption={selectedPhoto?.caption}
      />
    </>
  );
};
