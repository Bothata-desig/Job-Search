
import React, { useState } from 'react';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysis } from '../types';

export const ResumeOptimizer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeResume(resumeText);
      setResult(analysis);
    } catch (e) {
      console.error(e);
      alert("Something went wrong with the analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Paste Your Resume Content</h3>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your current resume text here..."
          className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-slate-300 shadow-lg shadow-indigo-100 flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                <span>Analyze Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <span className="text-slate-500 text-sm font-semibold mb-2">Overall Score</span>
              <div className="relative flex items-center justify-center w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * result.score) / 100}
                    className="text-indigo-600 transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-4xl font-bold text-slate-800">{result.score}</span>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-100 rounded-3xl p-6">
                <h4 className="text-green-800 font-bold mb-4 flex items-center">
                  <i className="fas fa-check-circle mr-2"></i> Key Strengths
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-700 flex items-start">
                      <span className="mr-2">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                <h4 className="text-red-800 font-bold mb-4 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i> Areas to Improve
                </h4>
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-red-700 flex items-start">
                      <span className="mr-2">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h4 className="text-xl font-bold text-slate-800 mb-6">AI Recommendations</h4>
            <div className="space-y-4">
              {result.suggestions.map((rec, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
