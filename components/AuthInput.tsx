import { InputHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function AuthInput({
  label,
  icon: Icon,
  error,
  className = '',
  ...props
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-5 h-5 text-pink-600" />
        <input
          {...props}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition ${
            error
              ? 'border-red-300 focus:ring-red-600'
              : 'border-gray-300'
          } ${className}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
