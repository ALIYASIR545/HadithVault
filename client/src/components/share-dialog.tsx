import { Share2, Twitter, Facebook, MessageCircle, Link, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  title: string;
  text: string;
  url?: string;
  buttonVariant?: 'default' | 'ghost' | 'outline';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  buttonClassName?: string;
}

export default function ShareDialog({
  title,
  text,
  url,
  buttonVariant = 'ghost',
  buttonSize = 'icon',
  buttonClassName = '',
}: ShareDialogProps) {
  const { toast } = useToast();
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${title}\n\n${text}\n\n${shareUrl}`);
    toast({ title: 'Copied to clipboard' });
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${title}\n\n${text.slice(0, 200)}...`
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${title}\n\n${text}\n\n${shareUrl}`
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          data-testid="button-share-open"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Share Hadith</DialogTitle>
          <DialogDescription className="text-slate-400">
            Share this hadith with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              onClick={handleNativeShare}
              className="w-full bg-islamic-teal hover:bg-islamic-teal/90 text-white"
              data-testid="button-native-share"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}

          {/* Twitter */}
          <Button
            onClick={handleTwitterShare}
            variant="outline"
            className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            data-testid="button-twitter-share"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>

          {/* Facebook */}
          <Button
            onClick={handleFacebookShare}
            variant="outline"
            className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            data-testid="button-facebook-share"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </Button>

          {/* WhatsApp */}
          <Button
            onClick={handleWhatsAppShare}
            variant="outline"
            className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            data-testid="button-whatsapp-share"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>

          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            data-testid="button-copy-link"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
