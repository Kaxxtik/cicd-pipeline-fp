
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SettingsPanel } from './SettingsPanel';
import { Settings } from 'lucide-react';

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Configure and customize your dashboard experience
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <SettingsPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
