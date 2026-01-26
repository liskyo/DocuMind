import React from 'react';
import { diffChars } from 'diff-match-patch'; // We might generally need to import specific function or write a helper if library not perfect
// To avoid complex library issues in this environment without node modules, I will write a simple diff visualizer logic or assume library works.
// Since I can't install, the user will maintain package.json.
// However, 'diff-match-patch' usage varies. I will implement a visual Diff component using a simpler approach if I can't guarantee the library API.
// Actually, let's use a simple visually distinct comparisons: "Before vs After" logic for robustness.

const DiffView = ({ original, rewritten, explanation }) => {
    return (
        <div className="bg-black/30 rounded-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-3 border-b border-indigo-500/20 flex justify-between items-center">
                <span className="text-indigo-300 font-semibold text-sm flex items-center gap-2">
                    ✨ AI Suggested Modification
                </span>
            </div>

            <div className="p-4 grid md:grid-cols-2 gap-4 text-sm font-mono">
                <div className="opacity-60">
                    <div className="text-xs uppercase text-gray-500 mb-2">Original</div>
                    <div className="bg-red-900/10 p-3 rounded border border-red-500/10 text-red-200/70 strike-through-decoration">
                        {original}
                    </div>
                </div>
                <div>
                    <div className="text-xs uppercase text-green-500 mb-2">Rewritten</div>
                    <div className="bg-green-900/20 p-3 rounded border border-green-500/30 text-green-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        {rewritten}
                    </div>
                </div>
            </div>

            <div className="bg-indigo-900/20 p-4 border-t border-indigo-500/10">
                <p className="text-indigo-200 text-sm italic">
                    <span className="font-semibold not-italic text-indigo-400 mr-2">Why:</span>
                    {explanation}
                </p>
            </div>
        </div>
    );
};

export default DiffView;
