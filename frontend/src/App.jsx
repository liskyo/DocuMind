import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, AlertTriangle, FileText, Globe, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Hexagon, Lock, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskMonitor from './components/RiskMonitor';
import QABot from './components/QABot';
import { translations } from './translations';

function App() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [lang, setLang] = useState('zh'); // Default to Chinese
    const [showSplash, setShowSplash] = useState(true);

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

            // detailed validity check
            if (response.data.error) {
                throw new Error(typeof response.data.error === 'string' ? response.data.error : JSON.stringify(response.data.error));
            }
            if (!response.data.findings || !Array.isArray(response.data.findings)) {
                throw new Error("Invalid response format: 'findings' array is missing.");
            }

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
        <AnimatePresence>
            {showSplash ? (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-docu-dark selection:bg-docu-accent selection:text-black overflow-hidden"
                >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        {/* 科技感大網格背景 */}
                        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]"></div>

                        {/* 漂浮的區塊鏈與合約圖示 */}
                        <div className="absolute inset-0 opacity-20">
                            {[
                                { Icon: Hexagon, size: 48, top: '20%', left: '15%', delay: 0 },
                                { Icon: Lock, size: 36, top: '70%', left: '80%', delay: 1 },
                                { Icon: Database, size: 40, top: '30%', left: '75%', delay: 2 },
                                { Icon: FileText, size: 52, top: '65%', left: '20%', delay: 0.5 },
                                { Icon: Hexagon, size: 32, top: '15%', left: '85%', delay: 1.5 },
                                { Icon: Database, size: 36, top: '80%', left: '40%', delay: 2.5 },
                            ].map((node, i) => (
                                <motion.div
                                    key={`node-${i}`}
                                    className="absolute text-docu-accent flex items-center justify-center"
                                    style={{ top: node.top, left: node.left }}
                                    animate={{
                                        y: [0, -25, 0],
                                        opacity: [0.1, 0.7, 0.1],
                                        rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{
                                        duration: 6 + (i % 3),
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: node.delay
                                    }}
                                >
                                    <node.Icon width={node.size} height={node.size} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                                </motion.div>
                            ))}
                        </div>

                        {/* 智能合約十六進制代碼流 */}
                        <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-20 select-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={`code-${i}`}
                                    className="absolute whitespace-nowrap text-docu-neon-purple font-mono text-xs tracking-widest font-bold"
                                    style={{ top: `${15 + i * 14}%`, left: '-100%' }}
                                    animate={{ x: ['0vw', '150vw'] }}
                                    transition={{ duration: 25 - (i % 3) * 2, repeat: Infinity, ease: 'linear', delay: i * 2 }}
                                >
                                    {`0x${(1234567 * (i + 1)).toString(16).padEnd(6, '0').toUpperCase()} [AI_VERIFY] > VALIDATING_CONTRACT_CLAUSES ... SECURE_HASH: ${(987654321 * (i + 1)).toString(16).padStart(12, '0').toUpperCase()} >>>`}
                                </motion.div>
                            ))}
                        </div>

                        {/* 兩顆主要的光暈 */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.15 }}
                            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            className="absolute w-[35rem] h-[35rem] bg-docu-accent rounded-full blur-[120px]"
                        />
                        <motion.div
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 0.8, opacity: 0.15 }}
                            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1, ease: "easeInOut" }}
                            className="absolute w-[30rem] h-[30rem] bg-docu-neon-purple rounded-full blur-[100px]"
                        />
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="relative mb-8">
                            <motion.div
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", damping: 15, delay: 0.5 }}
                                className="w-28 h-28 bg-gradient-to-tr from-docu-accent to-docu-neon-purple rounded-3xl shadow-neon-blue flex items-center justify-center relative z-10"
                            >
                                <ShieldCheck className="w-14 h-14 text-white" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, type: "spring" }}
                                className="absolute -top-3 -right-3 w-10 h-10 bg-docu-dark rounded-full flex items-center justify-center border-2 border-docu-accent z-20 shadow-lg"
                            >
                                <Sparkles className="w-5 h-5 text-docu-accent" />
                            </motion.div>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-3"
                        >
                            {t.appTitle}
                        </motion.h1>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            onClick={() => setShowSplash(false)}
                            className="mt-8 px-10 py-4 bg-gradient-to-r from-docu-accent to-docu-neon-purple rounded-full text-white font-bold text-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group relative overflow-hidden z-10 cursor-pointer"
                        >
                            <span className="relative z-10 flex items-center gap-2 tracking-widest">
                                {lang === 'en' ? 'START ANALYSIS' : '開始分析'}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div
                    key="main-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="min-h-screen bg-docu-dark text-white p-6 font-sans selection:bg-docu-accent selection:text-black"
                >
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
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default App
