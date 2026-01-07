import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConsoleSync } from '../../hooks/useConsoleSync';
import { creditService } from '../../lib/services/creditService';
import {
  Mic,
  Lightbulb,
  Sparkles,
  Code2,
  BookOpen,
  FileText,
  AlertTriangle,
  ArrowDown,
  Info,
  ArrowLeft
} from 'lucide-react';

export function LiveConsolePage() {
  const {
    connected,
    transcripts,
    finalizedText,
    hints,
    sessionStatus,
    sendCommand
  } = useConsoleSync();

  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<'transcript' | 'hints'>('transcript');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);

  /* ---------------- Credits ---------------- */
  useEffect(() => {
    const fetchCredits = async () => {
      const result = await creditService.getBalance();
      if (result.success && result.data) {
        setCredits(result.data.balance);
      }
    };
    fetchCredits();
  }, [sessionStatus]);

  /* ---------------- Auto scroll ---------------- */
  useEffect(() => {
    if (transcriptRef.current && !userScrolledUp) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [finalizedText, transcripts, userScrolledUp]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 80;
    setUserScrolledUp(!isAtBottom);
  };

  /* ---------------- Actions ---------------- */
  const requestHint = async (type: string) => {
    setLoading(true);
    setActivePanel('hints');

    await sendCommand('REQUEST_HINT', {
      requestType: type,
      trigger: 'manual'
    });

    setTimeout(() => setLoading(false), 3000);
  };

  const handleQuickPrompt = async () => {
    if (!quickPrompt.trim()) return;

    setLoading(true);
    setActivePanel('hints');

    await sendCommand('REQUEST_HINT', {
      requestType: 'custom',
      trigger: 'manual',
      customPrompt: quickPrompt
    });

    setQuickPrompt('');
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/90 to-primary/70 text-white shadow-lg rounded-xl mb-6 border border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6" />
              <div>
                <h1 className="text-lg font-bold">Interview Copilot Console</h1>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sessionStatus === 'active'
                        ? 'bg-green-400 animate-pulse'
                        : sessionStatus === 'session_found'
                        ? 'bg-yellow-400 animate-pulse'
                        : 'bg-slate-400'
                    }`}
                  />
                  {sessionStatus === 'active'
                    ? 'Live - Receiving Data'
                    : sessionStatus === 'session_found'
                    ? 'Session Found - Waiting for Data'
                    : 'Waiting for Session'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Connection banner */}
      {!connected && (
        <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-200 text-sm">
            <Info className="w-4 h-4" />
            Open meeting → Click extension → “Open Console”
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-[1fr_20%] gap-6 flex-1">
        {/* Transcript + Hints */}
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* Tabs */}
          <div className="flex bg-surface rounded-lg p-1 mb-4 border border-white/5">
            <button
              onClick={() => setActivePanel('transcript')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
                activePanel === 'transcript'
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              Transcript ({transcripts.length})
            </button>

            <button
              onClick={() => setActivePanel('hints')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
                activePanel === 'hints'
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
              AI Hints ({hints.length})
            </button>
          </div>

          {/* Content */}
          <div className="bg-surface rounded-xl flex-1 overflow-hidden border border-white/10 relative">
            {activePanel === 'transcript' && (
              <div
                ref={transcriptRef}
                onScroll={handleScroll}
                className="absolute inset-0 overflow-y-auto p-6"
              >
                {!finalizedText && transcripts.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    Listening for audio...
                  </div>
                ) : (
                  <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                    {finalizedText ||
                      transcripts.map((t, i) => (
                        <span key={i} className="mr-1">
                          {t.text}
                        </span>
                      ))}
                  </p>
                )}

                {userScrolledUp && (
                  <button
                    className="sticky bottom-2 mx-auto bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"
                    onClick={() => {
                      setUserScrolledUp(false);
                      transcriptRef.current!.scrollTop =
                        transcriptRef.current!.scrollHeight;
                    }}
                  >
                    <ArrowDown className="w-3 h-3" />
                    New text
                  </button>
                )}
              </div>
            )}

            {activePanel === 'hints' && (
              <div className="absolute inset-0 overflow-y-auto p-4 space-y-4">
                {loading && (
                  <div className="text-center text-slate-500">AI is thinking…</div>
                )}

                {!loading &&
                  hints.map((h, i) => (
                    <div
                      key={i}
                      className="bg-background border-l-4 border-primary rounded p-4"
                    >
                      <div className="text-xs text-slate-400 mb-2">
                        {h.timestamp}
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {h.hint || h.text}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 min-w-[200px]">
          <div className="bg-surface rounded-xl p-3 border border-white/10">
            <h2 className="text-[10px] text-slate-400 uppercase mb-2">
              Quick Actions
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => requestHint('help')}
                disabled={!connected || loading}
                className="action-btn"
              >
                <Sparkles className="w-3 h-3" /> Help Me
              </button>

              {/* ✅ ANSWER BUTTON PRESERVED */}
              <button
                onClick={() => requestHint('answer')}
                disabled={!connected || loading}
                className="action-btn"
              >
                <Sparkles className="w-3 h-3" /> Answer
              </button>

              <button
                onClick={() => requestHint('code')}
                disabled={!connected || loading}
                className="action-btn"
              >
                <Code2 className="w-3 h-3" /> Gen Code
              </button>

              <button
                onClick={() => requestHint('explain')}
                disabled={!connected || loading}
                className="action-btn border border-primary text-primary bg-transparent"
              >
                <BookOpen className="w-3 h-3" /> Explain
              </button>
            </div>
          </div>

          {/* Quick Prompt */}
          <div className="bg-surface rounded-xl p-3 border border-white/10">
            <textarea
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask…"
              className="w-full h-16 text-xs bg-background border border-white/10 rounded p-2 text-white"
            />
            <button
              onClick={handleQuickPrompt}
              disabled={!connected || loading}
              className="action-btn mt-2"
            >
              Send
            </button>
          </div>

          {/* Credits */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-green-400">{credits}</div>
            <div className="text-[10px] text-green-300">Credits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
