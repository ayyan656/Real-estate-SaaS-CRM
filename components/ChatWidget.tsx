import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Smile, MessageCircle, Minimize2 } from 'lucide-react';
import { Button } from './ui/Button';
import { generateChatResponse } from '../services/geminiService';

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const COMMON_EMOJIS = ['😊', '👍', '👋', '🏠', '❤️', '😂', '🤔', '🎉', '🔥', '💼', '🤝', '✅'];
const PLACEHOLDERS = [
  "Ask about features...",
  "Ask about pricing...",
  "How can I help?",
  "Type a message..."
];
const MAX_CHARS = 500;

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! 👋 Welcome to EstateFlow. How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        widgetRef.current && 
        !widgetRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setShowEmojiPicker(false);
    setIsTyping(true);

    try {
      const aiResponse = await generateChatResponse(userText);
      
      const newAgentMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAgentMsg]);
    } catch (error) {
       // Fallback logic is largely handled in service, but safe to keep
       const errorMsg: Message = {
         id: (Date.now() + 1).toString(),
         text: "I'm having trouble connecting right now. Please try again.",
         sender: 'agent',
         timestamp: new Date()
       };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInputText(text);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const imgMsg: Message = {
          id: Date.now().toString(),
          image: base64String,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, imgMsg]);
        
        // Simulate Agent Reply to Image (Gemini 2.5 Flash can handle images, 
        // but for this widget we'll keep the image flow simple/simulated or basic text response for now)
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Thanks for sharing that image! I'll have a human agent review it shortly.",
                sender: 'agent',
                timestamp: new Date()
            }]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addEmoji = (emoji: string) => {
    if (inputText.length + emoji.length <= MAX_CHARS) {
      setInputText(prev => prev + emoji);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={widgetRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="bg-white dark:bg-slate-900 w-[350px] md:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden font-sans transition-colors duration-200">
        
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                 <MessageCircle size={20} />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm">EstateFlow Support</h3>
              <p className="text-xs text-slate-300">Powered by AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <Minimize2 size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 overflow-y-auto space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-accent text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700 rounded-bl-none'
                  }
                `}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" className="rounded-lg max-w-full mt-1 border border-white/20" />
                )}
                <p className={`text-[10px] mt-1 text-right opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
           {showEmojiPicker && (
             <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 rounded-xl p-3 grid grid-cols-6 gap-2 animate-in zoom-in-95 duration-100">
               {COMMON_EMOJIS.map(emoji => (
                 <button 
                   key={emoji} 
                   onClick={() => addEmoji(emoji)}
                   className="text-xl hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded transition-colors"
                 >
                   {emoji}
                 </button>
               ))}
             </div>
           )}

           <div className="flex items-end gap-2">
             <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center p-1 relative focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Upload Image"
                >
                  <ImageIcon size={20} />
                </button>
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors ${showEmojiPicker ? 'text-yellow-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  title="Add Emoji"
                >
                  <Smile size={20} />
                </button>
                <textarea 
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={PLACEHOLDERS[placeholderIndex]}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 resize-none h-10 py-2 px-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:transition-opacity placeholder:duration-300"
                  rows={1}
                />
                <div className="absolute bottom-1 right-2 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50/80 dark:bg-slate-800/80 px-1 pointer-events-none">
                  {inputText.length}/{MAX_CHARS}
                </div>
             </div>
             <Button 
               onClick={handleSend} 
               disabled={!inputText.trim()}
               className={`rounded-xl h-[46px] w-[46px] p-0 flex items-center justify-center ${!inputText.trim() ? 'opacity-50' : ''}`}
             >
               <Send size={18} className={inputText.trim() ? 'ml-0.5' : ''} />
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
};