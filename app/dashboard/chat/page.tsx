'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Send, Loader } from 'lucide-react';
import api from '@/lib/api'; // Import the API client

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const coupleId = typeof window !== 'undefined' ? localStorage.getItem('coupleId') : null;

  useEffect(() => {
    if (!coupleId) {
      setError('Couple ID not found. Cannot connect to chat.');
      setIsLoading(false);
      return;
    }

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3001';

    // Fetch historical messages
    const fetchHistoricalMessages = async () => {
      try {
        const historicalData = await api.chat.getMessages(coupleId);
        setMessages(historicalData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch historical messages.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalMessages();

    // Initialize Socket.io
    const newSocket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket'], // Force websocket transport
    });

    newSocket.on('connect', () => {
      console.log('[Chat] Connected to socket server');
      setIsConnected(true);
      newSocket.emit('join', { coupleId, userId: user.id });
    });

    newSocket.on('message', (message: Message) => {
      console.log('[Chat] New message received:', message);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    newSocket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user.id) {
        setIsTyping(data.isTyping);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('[Chat] Disconnected from socket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Chat] Socket connection error:', err);
      setError(`Socket connection failed: ${err.message}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leave', { coupleId, userId: user.id });
      newSocket.close();
    };
  }, [coupleId, token, user.id]); // Dependencies for useEffect

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !coupleId) return;

    socket.emit('message', {
      coupleId,
      senderId: user.id,
      message: newMessage,
    });

    setNewMessage('');
    socket.emit('typing', { coupleId, userId: user.id, isTyping: false });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (socket && coupleId) {
      socket.emit('typing', { coupleId, userId: user.id, isTyping: true });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { coupleId, userId: user.id, isTyping: false });
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (error) {
    const isNoCouple = error.includes('Couple ID not found') || error.includes('coupleId');
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 text-center max-w-md mx-auto">
        <p className="text-gray-700 mb-4">
          {isNoCouple
            ? 'Invitez votre partenaire depuis l\'accueil pour accéder au chat.'
            : error}
        </p>
        {isNoCouple && (
          <Link href="/dashboard" className="text-pink-600 font-semibold hover:underline">
            Aller à l&apos;accueil
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Chat 💬</h1>
          <p className="text-gray-600 mt-1">
            {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-600 text-lg">Aucun message pour le moment</p>
                <p className="text-gray-400">Envoyez le premier message!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === user.id
                      ? 'bg-pink-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderId === user.id ? 'text-pink-100' : 'text-gray-600'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg rounded-bl-none">
                <p className="text-sm">Votre partenaire tape...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Votre message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50 flex items-center gap-2 font-semibold"
          >
            <Send className="w-5 h-5" />
            Envoyer
          </button>
        </form>
      </Card>
    </div>
  );
}
