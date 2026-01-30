'use client';

import React from "react"

import { useState } from 'react';
import { AuthInput } from './AuthInput';
import { Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function AuthForm({
  type,
  onSubmit,
  isLoading = false,
  error = '',
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (type === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const submitData =
      type === 'login'
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'register' && (
        <AuthInput
          label="Full Name"
          icon={User}
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          error={errors.name}
          required
        />
      )}

      <AuthInput
        label="Email"
        icon={Mail}
        type="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        error={errors.email}
        required
      />

      <AuthInput
        label="Password"
        icon={Lock}
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        error={errors.password}
        required
      />

      {type === 'register' && (
        <AuthInput
          label="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          required
        />
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? type === 'login'
            ? 'Signing in...'
            : 'Creating account...'
          : type === 'login'
            ? 'Sign In'
            : 'Sign Up'}
      </button>
    </form>
  );
}
