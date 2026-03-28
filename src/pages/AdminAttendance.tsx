import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAttendanceRecords } from '@/hooks/queries/useAttendance';
import { AttendanceRecord } from '@/types/attendance';
import { Search, Camera, Clock, LogIn, LogOut, CalendarDays, User } from 'lucide-react';

const scopeColors: Record<string, string> = {
  global: 'bg-primary/10 text-primary',
  project: 'bg-primary/20 text-card-foreground',
  team: 'bg-success/10 text-success',
};

const AdminAttendance = () => {
  const ITEMS_PER_PAGE = 15;
  const [search, setSearch] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'global' | 'project' | 'team'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);

  const { toast } = useToast();
  const { data: attendanceData, isLoading, error } = useAttendanceRecords({
    perPage: 1000, // Fetch all for client-side filtering
  });

  const records = (attendanceData?.data as AttendanceRecord[]) || [];

  // Apply search and scope filtering
  const filtered = records.filter(record => {
    const matchesSearch = 
      record.userName?.toLowerCase().includes(search.toLowerCase()) ||
      record.scopeName?.toLowerCase().includes(search.toLowerCase());
    const matchesScope = selectedScope === 'all' || record.scope === selectedScope;
    return matchesSearch && matchesScope;
  });

  // Calculate pagination on filtered results
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedRecords = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const scopeOptions = [
    { value: 'all', label: 'All Scopes' },
    { value: 'global', label: 'Global' },
    { value: 'project', label: 'Project' },
    { value: 'team', label: 'Team' },
  ];

  const formatDateUtil = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const displayHours = date.getHours() % 12 || 12;
    return `${month}/${day}/${year} ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Active';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const hasCheckOut = (record: AttendanceRecord) => !!record.checkOutTime;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading attendance records...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-destructive">Error loading attendance records</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage employee attendance records</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Records: <span className="font-semibold text-foreground">{records.length}</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card animate-fade-in p-6">
        <div className="mb-6 space-y-4 sm:flex sm:gap-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or scope..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <select
            value={selectedScope}
            onChange={e => {
              setSelectedScope(e.target.value as 'all' | 'global' | 'project' | 'team');
              setCurrentPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {scopeOptions.map(scope => (
              <option key={scope.value} value={scope.value}>
                {scope.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scope</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check-in</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check-out</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map(record => (
                  <tr 
                    key={record.id} 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedAttendance(record)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {record.userName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={scopeColors[record.scope]}>
                        {record.scope}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <LogIn className="h-4 w-4 text-success" />
                        {formatDateUtil(record.checkInTime)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.checkOutTime ? (
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4 text-destructive" />
                          {formatDateUtil(record.checkOutTime)}
                        </div>
                      ) : (
                        <span className="text-warning font-semibold">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDuration(record.duration)}
                    </td>
                    <td className="px-4 py-3">
                      {hasCheckOut(record) ? (
                        <Badge className="bg-success/20 text-success">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-warning/20 text-warning">
                          Active
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Attendance Details Dialog */}
      <Dialog open={!!selectedAttendance} onOpenChange={() => setSelectedAttendance(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedAttendance?.userName}
            </DialogTitle>
            <DialogDescription>
              Attendance Record Details
            </DialogDescription>
          </DialogHeader>
          {selectedAttendance && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Scope</p>
                  <div className="flex items-center gap-2">
                    <Badge className={scopeColors[selectedAttendance.scope]}>
                      {selectedAttendance.scope}
                    </Badge>
                    {selectedAttendance.scopeName && (
                      <p className="text-sm text-foreground">{selectedAttendance.scopeName}</p>
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Duration</p>
                  <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatDuration(selectedAttendance.duration)}
                  </p>
                </div>
              </div>

              {/* Check-in Information */}
              <div className="rounded-lg border border-success/30 bg-success/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LogIn className="h-5 w-5 text-success" />
                  <h3 className="font-semibold text-success">Check-in</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Time:</span> {formatDateUtil(selectedAttendance.checkInTime)}
                  </p>
                  {selectedAttendance.checkInPhoto && (
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Photo:</p>
                      <img 
                        src={selectedAttendance.checkInPhoto} 
                        alt="Check-in" 
                        className="h-32 w-32 rounded-lg object-cover border border-success/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Check-out Information */}
              {selectedAttendance.checkOutTime && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <LogOut className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">Check-out</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Time:</span> {formatDateUtil(selectedAttendance.checkOutTime)}
                    </p>
                    {selectedAttendance.checkOutPhoto && (
                      <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Photo:</p>
                      <img 
                        src={selectedAttendance.checkOutPhoto} 
                        alt="Check-out" 
                        className="h-32 w-32 rounded-lg object-cover border border-destructive/30"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                <p>Created: {formatDateUtil(selectedAttendance.createdAt)}</p>
                <p>Updated: {formatDateUtil(selectedAttendance.updatedAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminAttendance;
