"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MoreHorizontal, 
  RotateCcw,
  Paperclip,
  Camera,
  X,
  Image as ImageIcon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: "assistant", 
      content: "Hello! I'm your Lumiaxy AI study partner. How can I help you today? You can ask questions, upload an image of your notes/problems, or use your camera to capture something for me to analyze!", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please check permissions.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      setSelectedImage(canvas.toDataURL("image/jpeg"));
      stopCamera();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    
    // API formatting
    const chatHistory = messages.map(m => ({
      role: m.role,
      content: m.content
    })).concat({
      role: "user",
      content: input
    });

    const currentImage = selectedImage;
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: chatHistory,
          image: currentImage 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get AI response");

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] glass rounded-[32px] border border-white/10 overflow-hidden shadow-2xl relative">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02] relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center relative overflow-hidden">
             <Image 
                src="/fusion-orb.png" 
                alt="AI" 
                width={48} 
                height={48} 
                className="animate-swirl"
                priority
             />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Lumiaxy.ai</h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Advanced Vision Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setMessages([{ id: "1", role: "assistant", content: "Chat cleared. How can I help you?", timestamp: new Date() }])}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
           >
              <RotateCcw size={18} />
           </button>
        </div>
      </div>

      {/* Camera View Overlay */}
      <AnimatePresence>
        {cameraActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
            <div className="absolute bottom-10 flex items-center gap-10">
               <button onClick={stopCamera} className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white"><X size={24} /></button>
               <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white border-4 border-white/30 flex items-center justify-center" />
               <div className="w-14 h-14" /> {/* Spacer */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-dark-950/20">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border h-fit mt-1 ${
                  message.role === "assistant" 
                  ? "bg-brand/20 border-brand/30 text-brand" 
                  : "bg-white/5 border-white/10 text-white/40"
                }`}>
                  {message.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    message.role === "assistant" 
                    ? "bg-white/[0.03] border border-white/10 text-white/80 rounded-tl-none whitespace-pre-wrap" 
                    : "bg-brand text-white border border-brand-400/20 rounded-tr-none shadow-[0_10px_30px_rgba(98,114,241,0.3)]"
                  }`}>
                    {message.role === "user" && message.image && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                        <img src={message.image} alt="User upload" className="max-w-xs h-auto" />
                      </div>
                    )}
                    {message.content}
                    <p className={`text-[10px] mt-2 opacity-40 font-medium ${message.role === "user" ? "text-right" : ""}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center text-brand">
                  <Bot size={16} />
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                   {[0, 1, 2].map(i => (
                     <motion.div 
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-brand"
                     />
                   ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="text-center p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/[0.02] border-t border-white/10">
        {selectedImage && (
          <div className="mb-4 flex items-center gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl w-fit relative animate-in fade-in slide-in-from-bottom-2">
            <div className="w-16 h-16 rounded-lg overflow-hidden relative border border-white/10">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="pr-4">
               <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Document Selected</p>
               <p className="text-[11px] text-white/30">AI Vision will analyze this</p>
            </div>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <div className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 lg:gap-2">
               <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleImageFile}
               />
               <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-white/20 hover:text-brand hover:bg-brand/10 transition-all"
               >
                 <Paperclip size={18} />
               </button>
               <button 
                type="button" 
                onClick={startCamera}
                className="p-2 rounded-xl text-white/20 hover:text-cyan hover:bg-cyan/10 transition-all"
               >
                 <Camera size={18} />
               </button>
            </div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedImage ? "Add a message about this image..." : "Ask anything (e.g., Explain Newton's Third Law...)"}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-24 pr-12 text-sm text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all shadow-inner placeholder:text-white/10"
            />
          </div>
          
          <button 
            type="submit"
            disabled={(!input.trim() && !selectedImage) || isTyping}
            className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center transition-all hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 disabled:scale-100 shadow-[0_10px_25px_rgba(98,114,241,0.4)] group relative overflow-hidden shrink-0"
          >
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             <Send size={22} className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="text-[10px] text-center text-white/20 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
           <Sparkles size={12} className="text-brand" />
           Powered by Fusion AI Engine v2.0
        </p>
      </div>
    </div>
  );
}
