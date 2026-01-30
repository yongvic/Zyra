'use client';

import React from "react"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Gamepad2,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Accueil', href: '/dashboard' },
    { icon: MessageCircle, label: 'Chat', href: '/dashboard/chat' },
    { icon: Gamepad2, label: 'Jeux', href: '/dashboard/games' },
    { icon: Heart, label: 'Souvenirs', href: '/dashboard/memories' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:w-64 md:h-screen md:bg-white md:border-r md:border-gray-200 md:flex md:flex-col md:p-6">
        <Link href="/" className="text-2xl font-bold text-pink-600 mb-8 flex items-center gap-2">
          💕 Zyra
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition group"
            >
              <item.icon className="w-5 h-5 group-hover:text-pink-600" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          💕 Zyra
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden fixed inset-0 top-16 bg-white border-b border-gray-200 p-4 space-y-2 z-30">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition w-full mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </nav>
      )}

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-6">{children}</main>
    </div>
  );
}
