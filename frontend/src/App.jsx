import React, { useState } from 'react';
import axios from 'axios';
import { Upload, AlertTriangle, FileText, Globe, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskMonitor from './components/RiskMonitor';
import QABot from './components/QABot';
import { translations } from './translations';

function App() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [lang, setLang] = useState('zh'); // Default to Chinese

    const t = translations[lang];

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'zh' : 'en');
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setAnalyzing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTimeout(() => {
                const finalResult = { ...response.data, filename: file.name };
                setResult(finalResult);
                setAnalyzing(false);
            }, 1500);

        } catch (err) {
            setError(lang === 'en' ? "Analysis failed. Please check backend." : "分析失敗，請檢查後端是否啟動。");
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-docu-dark text-white p-6 font-sans selection:bg-docu-accent selection:text-black">
            <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4 sticky top-0 bg-docu-dark/80 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-tr from-docu-accent to-docu-neon-purple rounded-lg shadow-neon-blue">
                        <FileText className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {t.appTitle}
                        </h1>
                        <p className="text-xs text-docu-accent tracking-widest uppercase">{t.appSubtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700 hover:border-docu-accent hover:text-docu-accent transition-all text-sm text-gray-400 group"
                    >
                        <Globe className="w-4 h-4 group-hover:animate-spin-slow" />
                        <span>{lang === 'en' ? 'EN / 中' : '中 / EN'}</span>
                    </button>
                    <div className="text-sm text-gray-400 font-mono">
                        {analyzing ? (
                            <span className="text-risk-warn animate-pulse">● {t.statusScanning}</span>
                        ) : (
                            <span className="text-risk-safe">● {t.statusReady}</span>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {!result && !analyzing && (
                    <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-gray-800 rounded-2xl bg-docu-card/30 hover:bg-docu-card/50 hover:border-docu-accent/50 transition-all cursor-pointer relative group backdrop-blur-sm overflow-hidden">

                        <div className="absolute inset-0 bg-gradient-to-br from-docu-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".txt,.md,.pdf,.docx"
                        />

                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-gray-700 group-hover:border-docu-accent">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-docu-accent transition-colors" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-200 group-hover:text-white transition-colors">{t.uploadTitle}</h2>
                        <p className="text-gray-500 mt-3 text-lg">{t.uploadDesc}</p>

                        <div className="mt-8 px-6 py-2 bg-black/40 rounded-full border border-gray-800 text-xs text-gray-400 font-mono flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            {t.uploadFormats}
                        </div>
                    </div>
                )}

                {analyzing && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-docu-accent rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-4 border-4 border-docu-neon-purple rounded-full border-b-transparent animate-spin-reverse opacity-70"></div>
                        </div>
                        <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-docu-accent to-docu-neon-purple font-bold animate-pulse">
                            {t.analyzingTitle}
                        </p>
                        <p className="text-sm text-gray-500 mt-3 font-mono border-t border-gray-800 pt-3">{t.analyzingDesc}</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-risk-high/10 border border-risk-high/50 text-risk-high rounded-xl mb-6 flex items-center gap-3 backdrop-blur-md shadow-neon-red">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {result && (
                    <>
                        <div className="mb-6">
                            <button
                                onClick={() => setResult(null)}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                {t.backButton}
                            </button>
                        </div>
                        <RiskMonitor data={result} lang={lang} fileName={result.filename || "contract"} />
                        <QABot context={result} lang={lang} />
                    </>
                )}
            </main>
        </div>
    )
}

export default App
