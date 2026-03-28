import { MoreVertical, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useMarkInvoicePaidMutation, useDeleteInvoiceMutation } from '@/hooks/mutations/useInvoiceMutations';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/invoice';
import { formatDate } from '@/lib/utils';

interface InvoiceActionMenuProps {
  invoice: Invoice;
  onActionComplete?: () => void;
}

export const InvoiceActionMenu = ({ invoice, onActionComplete }: InvoiceActionMenuProps) => {
  const { toast } = useToast();
  const markPaidMutation = useMarkInvoicePaidMutation();
  const deleteMutation = useDeleteInvoiceMutation();

  const handleMarkPaid = async () => {
    try {
      await markPaidMutation.mutateAsync(invoice.id);
      toast({
        title: 'Success',
        description: `Invoice marked as paid on ${formatDate(new Date())}`,
      });
      onActionComplete?.();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to mark invoice as paid',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(invoice.id);
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
      });
      onActionComplete?.();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete invoice',
        variant: 'destructive',
      });
    }
  };

  const isLoading = markPaidMutation.isPending || deleteMutation.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {invoice.status !== 'paid' && (
          <>
            <DropdownMenuItem onClick={handleMarkPaid} disabled={isLoading}>
              <Check className="mr-2 h-4 w-4" />
              <span>Mark as Paid</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isLoading}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Invoice</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
