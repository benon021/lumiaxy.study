"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Send, 
  MessageSquare, 
  Megaphone, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Plus,
  X,
  Upload,
  BookOpen,
  List
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

interface Topic {
  id: string;
  name: string;
}

const POST_TYPES = [
  { id: "NOTES", label: "Notes", icon: FileText, color: "text-blue-400" },
  { id: "ASSIGNMENT", label: "Assignment", icon: Send, color: "text-purple-400" },
  { id: "DISCUSSION", label: "Discussion", icon: MessageSquare, color: "text-green-400" },
  { id: "GENERAL", label: "General Announcement", icon: Megaphone, color: "text-orange-400" },
];

const ASSIGNMENT_TYPES = [
  { id: "TEXT", label: "Text-based" },
  { id: "FILE", label: "File Upload" },
  { id: "MCQ", label: "MCQ Quiz" },
  { id: "HYBRID", label: "Hybrid (Text + File)" },
];

export default function TeacherPostingWizard({ onPostSuccess }: { onPostSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // Form State
  const [postType, setPostType] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignmentType, setAssignmentType] = useState("TEXT");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [mcqQuestions, setMcqQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch subjects and topics
    const fetchSubjects = async () => {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      if (data.success) setSubjects(data.subjects);
    };
    fetchSubjects();
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          title,
          description,
          subjectId: selectedSubject,
          topicId: selectedTopic,
          assignmentType,
          dueDate,
          maxScore,
          mcqQuestions
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(5); // Success step
        if (onPostSuccess) onPostSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto overflow-hidden">
      {/* Step Indicator */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
              step >= i ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500"
            }`}
          >
            {step > i ? <Check size={16} /> : i}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: SELECT TYPE */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">What are you creating?</h2>
            <p className="text-slate-400">Choose the type of content you want to post to your students.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {POST_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setPostType(type.id); handleNext(); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${
                    postType === type.id 
                      ? "border-blue-500 bg-blue-500/10" 
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                  }`}
                >
                  <type.icon size={32} className={`mb-3 ${type.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-white font-semibold">{type.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: CATEGORIZE */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Categorize your post</h2>
            <p className="text-slate-400">Select the subject and topic this post belongs to.</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(""); }}
                  className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400 block mb-2">Topic</label>
                <select
                  value={selectedTopic}
                  disabled={!selectedSubject}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                >
                  <option value="">Select Topic</option>
                  {selectedSubjectData?.topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
              <button 
                onClick={handleNext}
                disabled={!selectedSubject || !selectedTopic}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-3 font-semibold transition-all disabled:opacity-50 flex items-center"
              >
                Next <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CONTENT FORM */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Post Details</h2>
            
            <div className="space-y-4">
              {postType === "DISCUSSION" ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ask a simple question... (e.g. What is mitochondria's role?)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <textarea
                    placeholder="Add context or instructions for your students..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Post Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  
                  <textarea
                    placeholder="Description or Body Content..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </>
              )}

              {postType === "ASSIGNMENT" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Assignment Type</label>
                      <select 
                        value={assignmentType}
                        onChange={(e) => setAssignmentType(e.target.value)}
                        className="w-full h-10 bg-slate-800/50 border border-slate-700 rounded-lg px-3 text-sm text-white"
                      >
                        {ASSIGNMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Due Date</label>
                      <input 
                        type="date" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full h-10 bg-slate-800/50 border border-slate-700 rounded-lg px-3 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
              <button 
                onClick={handleNext}
                disabled={!title || !description}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-3 font-semibold transition-all disabled:opacity-50 flex items-center"
              >
                Next <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: REVIEW & POST */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Review your post</h2>
            
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center space-x-3 text-slate-500 text-sm">
                <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                  {postType}
                </span>
                <span>•</span>
                <span>{subjects.find(s => s.id === selectedSubject)?.name}</span>
                <span>•</span>
                <span>{selectedSubjectData?.topics.find(t => t.id === selectedTopic)?.name}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-slate-400 text-sm line-clamp-3">{description}</p>
              
              {postType === "ASSIGNMENT" && (
                <div className="flex items-center space-x-4 text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">
                  <div>TYPE: <span className="text-white font-medium">{assignmentType}</span></div>
                  <div>DUE: <span className="text-white font-medium">{dueDate || "None"}</span></div>
                  <div>MAX: <span className="text-white font-medium">{maxScore}</span></div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <button onClick={handleBack} className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} className="mr-1" /> Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-12 py-3 font-semibold transition-all flex items-center shadow-lg shadow-blue-600/20"
              >
                {loading ? "Posting..." : "Create Post"} <Send size={20} className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* SUCCESS STEP */}
        {step === 5 && (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/10">
              <Check size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white">Post Created!</h2>
            <p className="text-slate-400">Your content has been delivered to all eligible students.</p>
            <button 
              onClick={() => { setStep(1); setTitle(""); setDescription(""); }}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8 py-3 font-semibold transition-all"
            >
              Create Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
