import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book, Link, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

export interface EbookToggleProps {
  productId: number;
  initialEbookStatus: string | '0' | '1';
  initialVideoLink?: string | null;
  onEbookToggle: (productId: number, isEbook: boolean) => Promise<void>;
  onVideoLinkUpdate: (productId: number, videoLink: string) => Promise<void>;
}

export const EbookToggle: React.FC<EbookToggleProps> = ({
  productId,
  initialEbookStatus,
  initialVideoLink,
  onEbookToggle,
  onVideoLinkUpdate,
}) => {
  // Convert initial status to boolean
  const [isEbook, setIsEbook] = useState(initialEbookStatus === '1');
  const [videoLink, setVideoLink] = useState(initialVideoLink || '');
  const [showVideoInput, setShowVideoInput] = useState(!!initialVideoLink);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await onEbookToggle(productId, checked);
      setIsEbook(checked);
      
      // Show/hide video input based on ebook status
      if (!checked) {
        setShowVideoInput(false);
        setVideoLink('');
      } else if (videoLink) {
        setShowVideoInput(true);
      }
      
      toast.success(checked ? 'Product marked as E-book' : 'Product marked as Regular');
    } catch (error) {
      console.error('Failed to toggle ebook status:', error);
      toast.error('Failed to update ebook status');
      // Revert the toggle on error
      setIsEbook(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVideoLink = async () => {
    if (!videoLink.trim()) {
      toast.error('Please enter a valid video link');
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(videoLink)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      await onVideoLinkUpdate(productId, videoLink);
      toast.success('Video link updated successfully');
    } catch (error) {
      console.error('Failed to update video link:', error);
      toast.error('Failed to update video link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearVideoLink = () => {
    setVideoLink('');
    setShowVideoInput(false);
  };

  return (
    <div className="space-y-2">
      {/* E-book Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Book className={`w-4 h-4 ${isEbook ? 'text-primary' : 'text-muted-foreground'}`} />
          <Label htmlFor={`ebook-toggle-${productId}`} className="text-xs font-semibold cursor-pointer">
            E-book
          </Label>
        </div>
        <Switch
          id={`ebook-toggle-${productId}`}
          checked={isEbook}
          onCheckedChange={handleToggle}
          disabled={isLoading}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Video Link Input - Only shown when E-book is ON */}
      {isEbook && showVideoInput && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-muted-foreground" />
            <Label htmlFor={`video-link-${productId}`} className="text-[10px] font-medium text-muted-foreground">
              Video Link
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <Input
              id={`video-link-${productId}`}
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="h-7 text-xs bg-background"
              disabled={isLoading}
            />
            <button
              onClick={handleSaveVideoLink}
              disabled={isLoading || !videoLink.trim()}
              className="h-7 w-7 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Save video link"
            >
              {isLoading ? (
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleClearVideoLink}
              disabled={isLoading}
              className="h-7 w-7 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="Clear video link"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Enable video link button when ebook is ON but video input is hidden */}
      {isEbook && !showVideoInput && (
        <button
          onClick={() => setShowVideoInput(true)}
          className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-1"
        >
          <Link className="w-3 h-3" />
          Add Video Link
        </button>
      )}
    </div>
  );
};
