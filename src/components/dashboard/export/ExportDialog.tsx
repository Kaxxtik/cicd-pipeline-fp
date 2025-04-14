
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExportPanel } from './ExportPanel';
import { FileDown } from 'lucide-react';

export function ExportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FileDown className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Export Dashboard Data</DialogTitle>
          <DialogDescription>
            Download your dashboard data for analysis or reporting
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ExportPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
