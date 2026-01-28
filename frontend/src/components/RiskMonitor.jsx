import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Wand2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DiffView from './DiffView';
import { translations } from '../translations';

const RiskMonitor = ({ data, lang, fileName }) => {
    const { risk_score, analysis_summary, findings, full_text } = data;
    const [expandedId, setExpandedId] = useState(null);
    const [rewritingId, setRewritingId] = useState(null);
    const [isFixingAll, setIsFixingAll] = useState(false);
    const [isFixAllDone, setIsFixAllDone] = useState(false);
    const [fixProgress, setFixProgress] = useState({ current: 0, total: 0 });
    const [rewrites, setRewrites] = useState({});

    const t = translations[lang] || translations['en'];

    const getRiskColor = (type) => {
        switch (type) {
            case 'HIGH_RISK': return 'bg-risk-high/10 text-risk-high border-risk-high/20';
            case 'WARNING': return 'bg-risk-warn/10 text-risk-warn border-risk-warn/20';
            case 'SAFE_BUT_NOTE': return 'bg-risk-safe/10 text-risk-safe border-risk-safe/20';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    const getRiskLabel = (type) => {
        switch (type) {
            case 'HIGH_RISK': return t.riskHigh;
            case 'WARNING': return t.riskWarning;
            case 'SAFE_BUT_NOTE': return t.riskSafe;
            default: return type;
        }
    };

    const getRiskIcon = (type) => {
        switch (type) {
            case 'HIGH_RISK': return <ShieldAlert className="w-5 h-5" />;
            case 'WARNING': return <AlertCircle className="w-5 h-5" />;
            case 'SAFE_BUT_NOTE': return <CheckCircle2 className="w-5 h-5" />;
            default: return null;
        }
    };

    const handleRewrite = async (index, clause, role = 'Service Provider', tone = 'Balanced') => {
        setRewritingId(index);
        try {
            const response = await axios.post('/api/rewrite', {
                target_clause: clause,
                user_role: role,
                tone: tone
            });
            setRewrites(prev => ({ ...prev, [index]: response.data }));
        } catch (err) {
            console.error("Rewrite failed", err);
        } finally {
            setRewritingId(null);
        }
    };

    const handleFixAll = async () => {
        setIsFixingAll(true);
        setIsFixAllDone(false);
        const riskyItems = findings.map((item, idx) => ({ ...item, idx }))
            .filter(item => item.type === 'HIGH_RISK' || item.type === 'WARNING');

        setFixProgress({ current: 0, total: riskyItems.length });

        for (let i = 0; i < riskyItems.length; i++) {
            const item = riskyItems[i];
            if (rewrites[item.idx]) {
                setFixProgress(prev => ({ ...prev, current: i + 1 }));
                continue;
            }

            try {
                setExpandedId(item.idx);
                const response = await axios.post('/api/rewrite', {
                    target_clause: item.quote,
                    user_role: 'Service Provider',
                    tone: 'Balanced'
                });
                setRewrites(prev => ({ ...prev, [item.idx]: response.data }));
            } catch (err) {
                console.error(`Failed to fix item ${item.idx}`, err);
            }

            setFixProgress(prev => ({ ...prev, current: i + 1 }));
            await new Promise(r => setTimeout(r, 500));
        }
        setIsFixingAll(false);
        setIsFixAllDone(true);
        setExpandedId(null);
    };

    const handleDownload = async () => {
        let content = full_text || "";
        if (!content) {
            alert("Unable to download: Full text not available.");
            return;
        }

        // Apply rewrites
        Object.values(rewrites).forEach(rewrite => {
            if (rewrite && rewrite.original && rewrite.rewritten) {
                content = content.replace(rewrite.original, rewrite.rewritten);
            }
        });

        const nameParts = fileName.split('.');
        if (nameParts.length > 1) nameParts.pop();
        const baseName = nameParts.join('.');

        try {
            const response = await axios.post('/api/generate_document', {
                text: content,
                filename: baseName
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${baseName}_修正版.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to generate DOCX. Please try again.");
        }
    };

    const handleDownloadTxt = () => {
        let content = full_text || "";
        if (!content) {
            alert("Unable to download: Full text not available.");
            return;
        }

        // Apply rewrites
        Object.values(rewrites).forEach(rewrite => {
            if (rewrite && rewrite.original && rewrite.rewritten) {
                content = content.replace(rewrite.original, rewrite.rewritten);
            }
        });

        const nameParts = fileName.split('.');
        if (nameParts.length > 1) nameParts.pop();
        const baseName = nameParts.join('.');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${baseName}_修正版.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Dashboard Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Risk Score Card */}
                <div className="bg-docu-card rounded-2xl p-6 border border-gray-800 relative overflow-hidden shadow-2xl backdrop-blur-sm group hover:border-docu-accent/30 transition-all">
                    <div className="absolute -right-10 -top-10 bg-docu-accent/10 w-32 h-32 blur-3xl rounded-full group-hover:bg-docu-accent/20 transition-all"></div>

                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{t.riskScore}</h3>
                    <div className="flex items-end gap-2 mt-2 relative z-10">
                        <span className={`text-6xl font-bold tracking-tighter drop-shadow-lg ${risk_score < 60 ? 'text-risk-high' : risk_score < 85 ? 'text-risk-warn' : 'text-risk-safe'}`}>
                            {risk_score}
                        </span>
                        <span className="text-gray-500 mb-2 font-mono text-lg">/ 100</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${risk_score}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full shadow-[0_0_10px_currentColor] ${risk_score < 60 ? 'text-risk-high bg-risk-high' : risk_score < 85 ? 'text-risk-warn bg-risk-warn' : 'text-risk-safe bg-risk-safe'}`}
                        />
                    </div>
                </div>

                {/* Summary Card */}
                <div className="md:col-span-2 bg-docu-card rounded-2xl p-6 border border-gray-800 shadow-xl backdrop-blur-sm">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{t.summaryTitle}</h3>
                    <p className="text-gray-300 leading-relaxed font-light text-lg">{analysis_summary}</p>
                </div>
            </div>

            {/* Findings List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 border-l-4 border-docu-accent pl-3">
                    <h3 className="text-xl font-semibold text-white">{t.findingsTitle} <span className="text-gray-600 text-sm font-normal ml-2">({findings.length})</span></h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleFixAll}
                            disabled={isFixingAll || isFixAllDone}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-neon-blue transition-all disabled:opacity-80 ${isFixAllDone
                                ? "bg-green-600 text-white hover:bg-green-700 border border-green-400"
                                : "bg-gradient-to-r from-docu-neon-purple to-pink-600 hover:from-pink-500 hover:to-orange-500 text-white"
                                }`}
                        >
                            {isFixingAll ? (
                                <>
                                    <Wand2 className="w-4 h-4 animate-spin" />
                                    {t.fixingProgress} {fixProgress.current}/{fixProgress.total}
                                </>
                            ) : isFixAllDone ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {t.fixAllDone}
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    {t.fixAllButton}
                                </>
                            )}
                        </button>

                        {Object.keys(rewrites).length > 0 && (
                            <>
                                <button
                                    onClick={handleDownload}
                                    title="Download .docx"
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-bold border border-gray-600 transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    DOCX
                                </button>
                                <button
                                    onClick={handleDownloadTxt}
                                    title="Download .txt"
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-bold border border-gray-600 transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    TXT
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {findings.map((item, idx) => (
                    <div key={idx} className={`bg-docu-card rounded-xl border transition-all hover:bg-docu-card/80 ${getRiskColor(item.type)} border-opacity-30`}>

                        <div
                            className="p-5 flex items-start gap-4 cursor-pointer"
                            onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                        >
                            <div className={`mt-1 p-2 rounded-full bg-black/20 ${item.type === 'HIGH_RISK' ? 'text-risk-high' : item.type === 'WARNING' ? 'text-risk-warn' : 'text-risk-safe'}`}>
                                {getRiskIcon(item.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold text-lg text-gray-200">{item.category}</h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-current opacity-80 ${item.type === 'HIGH_RISK' ? 'text-risk-high' : item.type === 'WARNING' ? 'text-risk-warn' : 'text-risk-safe'}`}>
                                        {getRiskLabel(item.type)}
                                    </span>
                                </div>
                                <p className="text-gray-400 mt-1 line-clamp-2 text-sm">{item.reason}</p>
                            </div>
                            <div className="text-gray-500">
                                {expandedId === idx ? <ChevronUp /> : <ChevronDown />}
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedId === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-5 pt-0 border-t border-gray-700/50">
                                        <div className="mt-4 grid gap-4">

                                            <div className="bg-black/40 p-4 rounded-lg font-mono text-sm text-gray-300 relative border-l-2 border-gray-600">
                                                <span className="absolute -top-2 left-2 text-[10px] uppercase tracking-wider bg-gray-700 px-2 rounded text-gray-300 shadow-sm">{t.originalClause}</span>
                                                "{item.quote}"
                                            </div>

                                            <div className="bg-docu-accent/5 p-4 rounded-lg border border-docu-accent/20">
                                                <h5 className="text-docu-accent text-sm font-semibold mb-1 flex items-center gap-2">
                                                    <Wand2 className="w-3 h-3" /> {t.recommendation}
                                                </h5>
                                                <p className="text-gray-300 text-sm">{item.recommendation}</p>
                                            </div>

                                            {(item.type === 'HIGH_RISK' || item.type === 'WARNING') && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleRewrite(idx, item.quote); }}
                                                        disabled={rewritingId === idx}
                                                        className="group flex items-center gap-2 bg-gradient-to-r from-docu-accent to-blue-600 hover:from-white hover:to-docu-accent hover:text-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {rewritingId === idx ? (
                                                            <Wand2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                        )}
                                                        {rewrites[idx] ? t.regenerateButton : t.fixButton}
                                                    </button>
                                                </div>
                                            )}

                                            {rewrites[idx] && (
                                                <div className="mt-4">
                                                    <DiffView original={rewrites[idx].original} rewritten={rewrites[idx].rewritten} explanation={rewrites[idx].explanation} />
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default RiskMonitor;
