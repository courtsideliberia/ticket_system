import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onLogoChange: (url: string | undefined) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  onLogoChange,
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentLogoUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreview(result);
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onLogoChange(undefined);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-400" /> Custom Event Branding Logo
        </label>
        {preview && (
          <button
            onClick={handleRemove}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Remove Custom Logo
          </button>
        )}
      </div>

      {preview ? (
        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={preview} alt="Branding preview" className="h-10 w-auto object-contain rounded-md" />
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Logo applied to all passes
            </span>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/50 hover:bg-slate-950 transition-all cursor-pointer group">
          <Upload className="w-6 h-6 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-2" />
          <p className="text-xs font-bold text-slate-300">Click or drag logo image to upload</p>
          <p className="text-[10px] text-slate-500 mt-0.5">PNG, SVG, JPG up to 2MB (transparent background recommended)</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
};
