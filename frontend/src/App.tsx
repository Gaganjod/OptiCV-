import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { History, User, Moon, Rocket, Settings, CheckSquare, Search, List, Activity, HelpCircle, Edit3, Plus, UploadCloud, FileText, ChevronRight, Loader2, CheckCircle2, Zap, PenTool, Mail, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAnalyzeResume, useGenerateCoverLetter, type AnalysisResponse } from '@/hooks/useAnalyzeResume';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'analysis' | 'coverLetter'>('analysis');
  const [isCopied, setIsCopied] = useState(false);
  
  const analyzeMutation = useAnalyzeResume();
  const generateLetterMutation = useGenerateCoverLetter();
  
  const analysis: AnalysisResponse | undefined = analyzeMutation.data;
  const coverLetter = generateLetterMutation.data?.coverLetter;

  const handleGenerateCoverLetter = () => {
    if (!file || !jobDescription) return;
    generateLetterMutation.mutate({ file, jobDescription });
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1 
  });

  const handleAnalyze = () => {
    if (!file || !jobDescription) return;
    analyzeMutation.mutate({ file, jobDescription });
  };

  const radarData = [
    { subject: 'Impact', A: analysis ? analysis.matchScore + 10 : 0, fullMark: 100 },
    { subject: 'Clarity', A: analysis ? 85 : 0, fullMark: 100 },
    { subject: 'Brevity', A: analysis ? 70 : 0, fullMark: 100 },
    { subject: 'Action', A: analysis ? 90 : 0, fullMark: 100 },
    { subject: 'Keywords', A: analysis ? 100 - (analysis.missingKeywords.length * 10) : 0, fullMark: 100 },
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen font-sans p-4 xl:p-6 transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Zap className="w-6 h-6 text-white relative z-10" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
            OptiCV
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            <History className="w-4 h-4" /> History
          </button>
          <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            <User className="w-4 h-4" /> Profile
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
            <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <div 
              className="w-10 h-5 bg-indigo-500 rounded-full relative cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            >
              <motion.div 
                className="w-4 h-4 bg-white rounded-full absolute top-0.5"
                animate={{ left: darkMode ? '2px' : '22px' }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Structure - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)] overflow-hidden">
        
        {/* ======================= LEFT COLUMN ======================= */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
          <h2 className="text-xl font-bold mb-1 text-slate-800 dark:text-white">Resume Analysis</h2>
          
          {/* ATS Match Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-md dark:shadow-lg shrink-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-70" />
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">ATS Match Score</h3>
            </div>
            <div className="relative flex items-center justify-center w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" />
                <circle cx="50" cy="50" r="42" fill="none" 
                  className={cn("transition-all duration-1000 ease-out", analysis ? "stroke-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" : "stroke-slate-300 dark:stroke-slate-600")}
                  strokeWidth="12" strokeDasharray="264" 
                  strokeDashoffset={analysis ? 264 - (264 * analysis.matchScore) / 100 : 264} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                  {analysis ? `${analysis.matchScore}%` : '---'}
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">JOB: <span className="text-slate-800 dark:text-slate-200">Target Role</span></p>
          </motion.div>

          {/* Optimizations List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 shrink-0 relative overflow-hidden shadow-md dark:shadow-lg">
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-500/10 dark:from-orange-500/20 to-transparent blur-xl pointer-events-none" />
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Optimizations</h3>
              </div>
              <Settings className="w-4 h-4 text-slate-400" />
            </div>
            <ul className="space-y-4">
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Search className="w-4 h-4 text-orange-500 dark:text-orange-400"/> Keywords Missing:</span>
                <span className="font-bold text-slate-900 dark:text-white">{analysis ? analysis.missingKeywords.length : '-'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><List className="w-4 h-4 text-orange-500 dark:text-orange-400"/> Bullet Points Imp.:</span>
                <span className="font-bold text-slate-900 dark:text-white">{analysis ? analysis.bulletPointSuggestions.length : '-'}</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Edit3 className="w-4 h-4 text-emerald-500 dark:text-emerald-400"/> Summary Enhanced</span>
                {analysis && <CheckSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400"/>}
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><CheckSquare className="w-4 h-4 text-orange-500 dark:text-orange-400"/> Formatting Audit</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* ======================= CENTER COLUMN ======================= */}
        <div className="lg:col-span-6 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Workspace</h2>
            {analysis ? (
              <div className="flex bg-slate-200 dark:bg-white/10 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('analysis')}
                    className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-all", activeTab === 'analysis' ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
                  >
                    Analysis
                  </button>
                  <button 
                    onClick={() => setActiveTab('coverLetter')}
                    className={cn("px-4 py-1.5 rounded-md text-sm font-bold transition-all", activeTab === 'coverLetter' ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
                  >
                    Cover Letter
                  </button>
              </div>
            ) : (
              <button className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow">
                Comparison Mode
              </button>
            )}
          </div>

          {!analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 mb-6 shrink-0 h-full">
               <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col flex-1 min-h-[200px]">
                  <h3 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-500 dark:text-orange-400"/> Target Job Description</h3>
                  <Textarea 
                    placeholder="Paste the full job description here..."
                    className="flex-1 bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-orange-500 focus-visible:border-orange-500 resize-none rounded-xl p-4"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
               </div>
               <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden group flex-1 min-h-[200px]">
                  <div 
                    {...getRootProps()} 
                    className={cn(
                      "absolute inset-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-slate-50 dark:bg-transparent",
                      isDragActive ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-300 dark:border-white/10 hover:border-orange-400 hover:bg-slate-100 dark:hover:border-orange-500/50 dark:hover:bg-white/[0.02]'
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="w-14 h-14 mb-4 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                      <UploadCloud className="w-7 h-7 text-orange-500 dark:text-orange-400" />
                    </div>
                    {file ? (
                      <p className="text-orange-600 dark:text-orange-300 font-semibold text-sm">{file.name}</p>
                    ) : (
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Click or drag PDF resume here</p>
                    )}
                  </div>
               </div>
               {analyzeMutation.isError && (
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl mb-4 text-sm font-semibold shrink-0">
                   {analyzeMutation.error?.message || "An unknown error occurred. Make sure your Gemini API Key is set in Vercel!"}
                 </motion.div>
               )}
               <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-900/20 border-0 h-14 text-sm font-semibold transition-all group shrink-0"
                disabled={!file || !jobDescription || analyzeMutation.isPending}
                onClick={handleAnalyze}
              >
                {analyzeMutation.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Document...</>
                ) : (
                  <>Run AI Analysis <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </motion.div>
          )}

          {/* Text Comparison Views (Stacked) */}
          {analysis && activeTab === 'analysis' && (
            <div className="flex flex-col gap-6 shrink-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col min-h-[14rem] shadow-sm dark:shadow-none">
                <h3 className="text-sm font-semibold mb-3 text-slate-800 dark:text-slate-300">Original Resume Feedback</h3>
                <div className="flex-1 bg-slate-100 dark:bg-black/40 rounded-xl p-4 overflow-y-auto text-sm text-slate-700 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-white/5 min-h-0">
                  <span className="font-bold text-slate-900 dark:text-slate-200">Raw PDF Read:</span> The resume has been successfully parsed and evaluated against the job description.
                  <br/><br/>
                  <span className="font-bold text-slate-900 dark:text-slate-200">Analysis:</span> {analysis.overallFeedback}
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5 flex flex-col relative overflow-hidden group min-h-[14rem] shadow-md dark:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 dark:from-orange-500/10 to-transparent opacity-100 transition-opacity pointer-events-none" />
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Optimized Resume Text</h3>
                  <Rocket className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-black/40 rounded-xl p-4 overflow-y-auto text-sm text-slate-800 dark:text-slate-300 leading-relaxed border border-orange-200 dark:border-orange-500/20 min-h-0 relative z-10">
                  Based on the AI findings, inject the following missing keywords into your skills section:
                  <br/><br/>
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i}>
                      Add <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-500/30 shadow-sm dark:shadow-[0_0_8px_rgba(245,158,11,0.3)] font-medium mx-1">{kw}</span>. 
                    </span>
                  ))}
                  <br/><br/>
                  {analysis.bulletPointSuggestions.length > 0 && (
                    <>
                      <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 font-medium">Action Verbs:</span> Ensure your impact starts with strong verbs.
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Middle Split View: Summary & Experience */}
          {analysis && analysis.bulletPointSuggestions.length > 0 && activeTab === 'analysis' && (
            <div className="flex flex-col gap-6 shrink-0 mt-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col min-h-0 shrink-0 shadow-sm dark:shadow-none">
                <h3 className="text-sm font-semibold mb-3 text-slate-800 dark:text-white">Summary Improvement (Before)</h3>
                <div className="flex-1 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-400 mb-4 overflow-y-auto min-h-0">
                  {analysis.bulletPointSuggestions[0].original}
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs rounded-full font-medium">Weak Action Verb</span>
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs rounded-full font-medium">Low Impact</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 flex flex-col relative overflow-hidden shadow-md dark:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] min-h-0 shrink-0">
                <h3 className="text-sm font-semibold mb-3 text-slate-900 dark:text-white">Summary Improvement (After)</h3>
                <div className="flex-1 bg-emerald-50/50 dark:bg-black/40 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-xl text-sm text-slate-800 dark:text-slate-200 mb-4 overflow-y-auto min-h-0">
                   <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium mr-1">Improved:</span> 
                   {analysis.bulletPointSuggestions[0].suggested}
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-full font-medium">Strong Action Verb</span>
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs rounded-full font-medium">Result-Driven</span>
                </div>
              </motion.div>
            </div>
          )}

          {/* Cover Letter View */}
          {analysis && activeTab === 'coverLetter' && (
             <div className="flex flex-col gap-6 shrink-0 h-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col shadow-sm dark:shadow-none min-h-[500px]">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-semibold text-slate-800 dark:text-white">AI Cover Letter Generator</h3>
                     <div className="flex gap-2">
                       {coverLetter && (
                         <Button 
                           variant="outline"
                           className="border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 h-9 transition-all"
                           onClick={handleCopy}
                         >
                           {isCopied ? (
                             <><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Copied!</>
                           ) : (
                             <><Copy className="w-4 h-4 mr-2" /> Copy</>
                           )}
                         </Button>
                       )}
                       <Button 
                         className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md text-sm h-9"
                         onClick={handleGenerateCoverLetter}
                         disabled={generateLetterMutation.isPending}
                       >
                         {generateLetterMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenTool className="w-4 h-4 mr-2" />}
                         {coverLetter ? 'Regenerate' : 'Generate Cover Letter'}
                       </Button>
                     </div>
                   </div>
                   
                   {generateLetterMutation.isError && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl mb-4 text-sm font-semibold shrink-0">
                       {generateLetterMutation.error?.message || "An unknown error occurred during generation."}
                     </motion.div>
                   )}

                   {coverLetter ? (
                     <div className="flex-1 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 p-6 rounded-xl text-sm text-slate-800 dark:text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner font-serif">
                       {coverLetter}
                     </div>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/10 rounded-xl p-6 text-center">
                        <Mail className="w-12 h-12 text-slate-300 dark:text-white/20 mb-4" />
                        <h4 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">Create a Tailored Cover Letter</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                           Click the button above to generate a highly professional cover letter. It will perfectly connect your past experience to the requirements of the job description.
                        </p>
                     </div>
                   )}
                </motion.div>
             </div>
          )}
        </div>

        {/* ======================= RIGHT COLUMN ======================= */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
          <h2 className="text-xl font-bold mb-1 opacity-0">Hidden Spacer</h2>
          
          {/* Parsed Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-md dark:shadow-lg shrink-0 min-h-[200px]">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-200/50 dark:bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Parsed Skills</h3>
              </div>
              <Rocket className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex flex-wrap gap-3 relative z-10">
              {analysis && analysis.missingKeywords.length === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center font-medium"><CheckCircle2 className="w-4 h-4 mr-2"/> All keywords present</span>
              ) : analysis ? (
                analysis.missingKeywords.slice(0, 10).map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 rounded-full text-xs font-semibold border border-amber-300 dark:border-amber-500/50 shadow-sm dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    {kw} (Missing)
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm italic">Upload resume to extract skills</span>
              )}
              {analysis && (
                <button className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-white/10 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors mt-1">
                  Add Skill <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Impact Analysis (Radar Chart) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-5 relative shrink-0 min-h-[300px] shadow-md dark:shadow-none">
            <h3 className="text-sm font-semibold mb-6 text-slate-800 dark:text-slate-200">Impact Analysis</h3>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                  <PolarAngleAxis dataKey="subject" tick={{fill: darkMode ? '#94a3b8' : '#334155', fontSize: 10, fontWeight: 500}} />
                  <Radar name="Impact" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 border border-orange-300 dark:border-orange-500/50 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-500/40 transition-colors shadow-sm dark:shadow-lg dark:shadow-orange-500/10">
              <HelpCircle className="w-4 h-4" />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default App;
