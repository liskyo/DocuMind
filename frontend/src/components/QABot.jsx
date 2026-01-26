import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../translations';

const QABot = ({ context, lang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    const t = translations[lang] || translations['en'];

    const [history, setHistory] = useState([
        { role: 'ai', content: t.botWelcome }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = query;
        setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setQuery('');
        setLoading(true);

        try {
            const response = await axios.post('/api/rag', {
                query: userMsg,
                context_chunks: JSON.stringify(context).substring(0, 10000)
            });

            setHistory(prev => [...prev, { role: 'ai', content: response.data.answer }]);
        } catch (err) {
            setHistory(prev => [...prev, { role: 'ai', content: t.botError }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-docu-accent to-docu-neon-purple text-black font-bold p-4 rounded-full shadow-neon-blue hover:shadow-cyan-400/50 transition-all z-50 flex items-center gap-2 group hover:scale-105"
            >
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-white">{t.askAI}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-96 h-[500px] bg-docu-card/95 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex justify-between items-center border-b border-gray-800">
                            <div className="flex items-center gap-2 text-white">
                                <div className="p-1 bg-docu-accent rounded-lg">
                                    <Bot className="w-4 h-4 text-black" />
                                </div>
                                <span className="font-semibold">{t.botTitle}</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                            {history.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-docu-accent to-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 rounded-2xl p-3 border border-gray-700 flex gap-1 items-center">
                                        <span className="w-2 h-2 bg-docu-accent rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-docu-accent rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-docu-accent rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t.inputPlaceholder}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-gray-200 focus:outline-none focus:border-docu-accent focus:ring-1 focus:ring-docu-accent/50 transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-2 p-1.5 bg-docu-accent hover:bg-white hover:text-black text-black rounded-lg transition-colors shadow-lg shadow-docu-accent/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default QABot;
