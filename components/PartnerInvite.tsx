'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Copy, Check } from 'lucide-react';

interface PartnerInviteProps {
  coupleId?: string;
  onInviteSent?: (email: string) => void;
}

export function PartnerInvite({ coupleId, onInviteSent }: PartnerInviteProps) {
  const [email, setEmail] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInviteLink = () => {
    if (!coupleId) {
      setError('Couple not found');
      return;
    }

    const link = `${window.location.origin}/join?couple=${coupleId}`;
    setInviteLink(link);
  };

  const handleCopy = () => {
    if (!inviteLink) return;

    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Send invite email via backend
      // For now, just show success
      if (onInviteSent) {
        onInviteSent(email);
      }

      setEmail('');
      setCoupleName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setIsLoading(false);
    }
  };

  if (!coupleId) {
    return (
      <Card className="p-8 text-center">
        <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invite Your Partner
        </h2>
        <p className="text-gray-600 mb-6">
          Create a couple account or connect with your existing partner to start
          playing games, sharing memories, and chatting together.
        </p>
        <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold">
          Create Couple Account
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Invite Your Partner
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Generate Link */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Share an Invite Link</h3>
          {!inviteLink ? (
            <button
              onClick={generateInviteLink}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
            >
              Generate Link
            </button>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Share this link with your partner to let them join
              </p>
            </>
          )}
        </div>

        {/* Send Email Invite */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Or Send by Email</h3>
          <form onSubmit={handleSendInvite} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              required
            />
            <input
              type="text"
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              placeholder="Couple name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
    </Card>
  );
}
