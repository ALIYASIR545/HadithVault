import { Minus, Plus, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFontSize } from '@/contexts/FontSizeContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  const isSmallest = fontSize === 'small';
  const isLargest = fontSize === 'extra-large';

  const getFontSizeLabel = () => {
    switch (fontSize) {
      case 'small':
        return 'Small';
      case 'medium':
        return 'Medium';
      case 'large':
        return 'Large';
      case 'extra-large':
        return 'Extra Large';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          data-testid="button-font-size"
        >
          <Type className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-slate-800 border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-white">Text Size</h4>
            <span className="text-xs text-slate-400">{getFontSizeLabel()}</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decreaseFontSize}
              disabled={isSmallest}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50"
              data-testid="button-decrease-font"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white">A</div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={increaseFontSize}
              disabled={isLargest}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50"
              data-testid="button-increase-font"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-slate-400 text-center">
            Adjust text size for better readability
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
