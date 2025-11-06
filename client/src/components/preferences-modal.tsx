import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { UserPreferences } from "@shared/schema";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const [fontSize, setFontSize] = useState("medium");
  const [theme, setTheme] = useState("light");
  const [showDiacritics, setShowDiacritics] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
    enabled: isOpen,
  });

  const updatePreferences = useMutation({
    mutationFn: async (prefs: Partial<UserPreferences>) => {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!response.ok) throw new Error("Failed to update preferences");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({ title: "Preferences updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ 
        title: "Failed to update preferences", 
        variant: "destructive" 
      });
    },
  });

  useEffect(() => {
    if (preferences) {
      setFontSize(preferences.fontSize || "medium");
      setTheme(preferences.theme || "light");
      setShowDiacritics(preferences.showDiacritics ?? true);
      setAutoPlayAudio(preferences.autoPlayAudio ?? false);
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences.mutate({
      fontSize,
      theme,
      showDiacritics,
      autoPlayAudio,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-preferences">
        <DialogHeader>
          <DialogTitle>Reading Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="block text-sm font-medium mb-2">Font Size</Label>
            <div className="flex space-x-2">
              {["small", "medium", "large"].map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFontSize(size)}
                  data-testid={`button-font-${size}`}
                  className={fontSize === size ? "bg-islamic-teal hover:bg-islamic-teal/90" : ""}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Display Mode</Label>
            <div className="flex space-x-2">
              {["light", "dark"].map((mode) => (
                <Button
                  key={mode}
                  variant={theme === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(mode)}
                  data-testid={`button-theme-${mode}`}
                  className={theme === mode ? "bg-islamic-teal hover:bg-islamic-teal/90" : ""}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diacritics"
                checked={showDiacritics}
                onCheckedChange={(checked) => setShowDiacritics(checked === true)}
                data-testid="checkbox-diacritics"
              />
              <Label htmlFor="diacritics" className="text-sm">
                Show diacritics in Arabic text
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoplay"
                checked={autoPlayAudio}
                onCheckedChange={(checked) => setAutoPlayAudio(checked === true)}
                data-testid="checkbox-autoplay"
              />
              <Label htmlFor="autoplay" className="text-sm">
                Auto-play audio
              </Label>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-testid="button-cancel-preferences"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-islamic-teal hover:bg-islamic-teal/90"
            onClick={handleSave}
            disabled={updatePreferences.isPending}
            data-testid="button-save-preferences"
          >
            {updatePreferences.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
