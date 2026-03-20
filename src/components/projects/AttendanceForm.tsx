import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, CheckCircle2, LogOut, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveAttendance } from "@/hooks/queries/useAttendance";
import { useCheckInMutation, useCheckOutMutation } from "@/hooks/mutations/useAttendanceMutations";
import { useProjects } from "@/hooks/queries/useProjects";
import { useTeamMembers } from "@/hooks/queries/useTeamMembers";
import { useToast } from "@/hooks/use-toast";
import { useAttendanceStore } from "@/stores/attendance.store";
import { imageOptimization } from "@/lib/imageOptimization";

interface AttendanceFormProps {
  capturedPhoto?: string | null;
  onCaptureTrigger: () => void;
  onSuccess?: () => void;
}

export const AttendanceForm = ({ capturedPhoto, onCaptureTrigger, onSuccess }: AttendanceFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null);
  const {
    selectedScope,
    setSelectedScope,
    setSelectedProjectId,
    setSelectedTeamId,
    selectedProjectId,
    selectedTeamId,
  } = useAttendanceStore();

  const { data: activeAttendance, refetch: refetchActive } = useActiveAttendance();
  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();
  
  // Fetch projects and teams for dropdowns
  const { data: projectsData } = useProjects(1, 100);
  const { data: teamsData } = useTeamMembers(1, 100);

  const isCheckedIn = activeAttendance?.isCheckedIn ?? false;

  // Extract projects and teams from response data
  const projects = (projectsData?.data as any) || [];
  const teams = (teamsData?.data as any) || [];

  // Helper function to extract error message from various error formats
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "An error occurred";
  };

  // The hook already polls every 2 seconds, so we don't need manual refetch
  // Just clear timer when user checks out
  useEffect(() => {
    if (!isCheckedIn && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [isCheckedIn, timerInterval]);

  const handleCheckIn = async () => {
    setError(null);

    if (!capturedPhoto) {
      const msg = "Please capture a photo before checking in";
      setError(msg);
      toast({
        title: "Photo Required",
        description: msg,
        variant: "destructive",
      });
      return;
    }

    if (!selectedScope) {
      const msg = "Please select an attendance scope";
      setError(msg);
      toast({
        title: "Selection Required",
        description: msg,
        variant: "destructive",
      });
      return;
    }

    try {
      // Optimize image before sending
      const optimizedPhoto = await imageOptimization.compressBase64(capturedPhoto);

      await checkInMutation.mutateAsync({
        scope: selectedScope,
        scope_id: selectedScope === 'global' ? undefined : (selectedScope === 'project' ? selectedProjectId : selectedTeamId) || undefined,
        photo: optimizedPhoto,
      });

      setError(null);
      toast({
        title: "Success ✓",
        description: "You have successfully checked in",
      });

      // Wait for data to be updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refetchActive();
      onSuccess?.();
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast({
        title: "Check-in Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async () => {
    setError(null);

    if (!activeAttendance?.attendance?.id) {
      const msg = "No active attendance record found";
      setError(msg);
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      return;
    }

    if (!capturedPhoto) {
      const msg = "Please capture a photo before checking out";
      setError(msg);
      toast({
        title: "Photo Required",
        description: msg,
        variant: "destructive",
      });
      return;
    }

    try {
      // Optimize image before sending
      const optimizedPhoto = await imageOptimization.compressBase64(capturedPhoto);

      await checkOutMutation.mutateAsync({
        attendanceId: activeAttendance.attendance.id,
        photo: optimizedPhoto,
      });

      setError(null);
      toast({
        title: "Success ✓",
        description: "You have successfully checked out",
      });

      // Wait for data to be updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refetchActive();
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      onSuccess?.();
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast({
        title: "Check-out Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const formatTime = (checkInTime?: string) => {
    if (!checkInTime) return "";
    return new Date(checkInTime).toLocaleTimeString();
  };

  const getTimeElapsed = () => {
    if (!activeAttendance?.checkInTime) return "00:00:00";

    const checkInDate = new Date(activeAttendance.checkInTime);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - checkInDate.getTime()) / 1000);

    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Check In / Check Out</CardTitle>
        <CardDescription>
          Manage your attendance with photo verification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* User Info */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
          </div>
          <Badge variant={isCheckedIn ? "default" : "secondary"}>
            {isCheckedIn ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : null}
            {isCheckedIn ? "Checked In" : "Checked Out"}
          </Badge>
        </div>

        {/* Current Status */}
        {isCheckedIn && activeAttendance?.attendance && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Clock className="h-4 w-4" />
              Current Session
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-primary/70">Check In Time</div>
                <div className="font-semibold">
                  {formatTime(activeAttendance.attendance.checkInTime)}
                </div>
              </div>
              <div>
                <div className="text-xs text-primary/70">Time Elapsed</div>
                <div className="font-semibold font-mono text-lg">
                  {getTimeElapsed()}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isCheckedIn && (
          <>
            {/* Scope Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Attendance Scope</label>
              <Select
                value={selectedScope || ""}
                onValueChange={(value: any) => {
                  setSelectedScope(value);
                  setSelectedProjectId(null);
                  setSelectedTeamId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Company (Global)</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Selection */}
            {selectedScope === "project" && (
              <div className="space-y-3">
                <label className="text-sm font-semibold">Select Project</label>
                <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects && projects.length > 0 ? (
                      projects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No projects available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Team Selection */}
            {selectedScope === "team" && (
              <div className="space-y-3">
                <label className="text-sm font-semibold">Select Team</label>
                <Select value={selectedTeamId || ""} onValueChange={setSelectedTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams && teams.length > 0 ? (
                      teams.map((team: any) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name || `Team ${team.id?.substring(0, 8)}`}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No teams available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Photo Status */}
            {capturedPhoto ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription>Photo captured ✓</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="default" className="bg-warning/10 border-warning/30">
                <AlertDescription>Photo required for check-in</AlertDescription>
              </Alert>
            )}

            {/* Camera Button */}
            <Button
              onClick={onCaptureTrigger}
              variant="outline"
              className="w-full"
              disabled={checkInMutation.isPending}
            >
              📷 Open Camera
            </Button>

            {/* Check In Button */}
            <Button
              onClick={handleCheckIn}
              className="w-full bg-success hover:bg-success/90"
              disabled={
                checkInMutation.isPending ||
                !capturedPhoto ||
                !selectedScope ||
                (selectedScope !== 'global' && !selectedProjectId && !selectedTeamId)
              }
            >
              {checkInMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              Check In
            </Button>
          </>
        )}

        {isCheckedIn && (
          <div className="space-y-4">
            {/* Photo Option for Check-out */}
            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <div className="text-sm font-semibold text-warning mb-2 flex items-center gap-2">
                {capturedPhoto ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Check-out photo captured
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Required: Capture check-out photo
                  </>
                )}
              </div>
              <Button
                onClick={onCaptureTrigger}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={checkOutMutation.isPending}
              >
                📷 {capturedPhoto ? "Change Photo" : "Capture Photo"}
              </Button>
            </div>

            {/* Check Out Button */}
            <Button
              onClick={handleCheckOut}
              size="lg"
              variant="destructive"
              className="w-full"
              disabled={checkOutMutation.isPending || !capturedPhoto}
            >
              {checkOutMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing Check-out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Check Out
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
