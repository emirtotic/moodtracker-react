import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { analyze, createPlan } from '../services/ai';

type PlanDay = { day: number; items: string[] };

function parsePlan(text: string): PlanDay[] {
  const blocks = text.split(/\n\s*\n/g).map(b => b.trim()).filter(Boolean);
  const days: PlanDay[] = [];
  let current: PlanDay | null = null;

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const m = /^Day\s+(\d+)/i.exec(lines[0]);
    if (m) {
      current = { day: Number(m[1]), items: [] };
      days.push(current);
      const rest = lines.slice(1);
      if (rest.length) current!.items.push(...rest);
    } else {
      if (!current) {
        current = { day: days.length + 1, items: [] };
        days.push(current);
      }
      current.items.push(...lines);
    }
  }
  return days;
}

export default function Stats() {
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [summary, setSummary] = useState<string | undefined>();
  const [average, setAverage] = useState<number | undefined>();
  const [suggestions, setSuggestions] = useState<string[] | undefined>();

  const [planRaw, setPlanRaw] = useState<string | undefined>();
  const [plan, setPlan] = useState<PlanDay[] | undefined>();

  // Uvodni tekst (nestaje nakon prve analize)
  const [showIntro, setShowIntro] = useState(true);

  const runAnalyze = async () => {
    setLoadingAnalyze(true);
    setShowIntro(false);
    try {
      const r = await analyze();
      setAverage(r.average);
      setSummary(r.summary);
      setSuggestions(r.suggestions);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Analyze failed');
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const runPlan = async () => {
    setLoadingPlan(true);
    try {
      const r = await createPlan(); // { response: "Day 1\n..." }
      setPlanRaw(r.response);
      setPlan(parsePlan(r.response));
      setTimeout(
        () => document.getElementById('plan-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        50
      );
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Plan generation failed');
    } finally {
      setLoadingPlan(false);
    }
  };

  const hasResults =
    typeof average !== 'undefined' || !!summary || (suggestions && suggestions.length > 0);

  const planText = useMemo(() => {
    if (!plan) return '';
    return plan.map(d => [`Day ${d.day}`, ...d.items].join('\n')).join('\n\n');
  }, [plan]);

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planText);
      alert('Plan copied to clipboard!');
    } catch {
      alert('Could not copy. Try “Download .txt”.');
    }
  };

  const downloadPlan = () => {
    const blob = new Blob([planText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'mood-plan.txt';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // sticky bar prikazujemo tek nakon analize
  const showSticky = hasResults;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        className={
          `flex-1 max-w-5xl mx-auto px-4 py-8 md:py-10 ` +
          (showSticky ? 'pb-24 md:pb-10' : '')
        }
      >
        {/* Naslov + uvod + CTA (centar) */}
        <section className="mb-6 flex flex-col items-center text-center gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Statistics</h1>

          {showIntro && (
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              Analyze the moods you’ve recorded over time. Our AI will summarize your patterns and share caring, 
              practical suggestions to help you improve—or maintain—your well-being when things are going well. 
              After the analysis, you can generate a personalized 7-day plan for happier, healthier days.
            </p>
          )}

          <button
            onClick={runAnalyze}
            disabled={loadingAnalyze}
            className="rounded-lg bg-emerald-600 text-white px-6 py-3 text-base font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
            aria-label="Analyze my moods"
          >
            {loadingAnalyze ? 'Analyzing…' : 'Analyze my moods'}
          </button>
        </section>

        {/* Rezultati */}
        {hasResults && (
          <section aria-live="polite" className="mt-6 space-y-4">
            {typeof average !== 'undefined' && (
              <div className="text-slate-700 text-sm md:text-base">
                Average mood rate:{' '}
                <span className="font-semibold">{average.toFixed(2)}</span>
              </div>
            )}

            {summary && (
              <div className="text-slate-700 bg-white rounded-xl p-4 border border-[#EEE7DC] text-sm md:text-base">
                {summary}
              </div>
            )}

            {suggestions && suggestions.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-[#EEE7DC]">
                <h3 className="font-semibold text-slate-800 mb-2 text-sm md:text-base">
                  Suggestions
                </h3>
                <ul className="list-disc pl-5 md:pl-6 text-slate-700 text-sm md:text-base space-y-1">
                  {suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Sticky CTA za plan (pojavljuje se nakon analize) */}
        {showSticky && (
          <div
            className="
              md:static fixed left-0 right-0 bottom-0 md:bottom-auto
              z-50
              bg-[#FAF7F2]/90 md:bg-transparent
              backdrop-blur supports-[backdrop-filter]:bg-[#FAF7F2]/70
              border-t md:border-0 border-[#EEE7DC]
              px-4 py-3 md:p-0
              pb-[env(safe-area-inset-bottom)]
              shadow-md md:shadow-none
            "
          >
            <br></br>
            <div className="max-w-5xl mx-auto flex justify-center md:justify-start">
              <button
                onClick={runPlan}
                disabled={loadingPlan}
                className="rounded-lg bg-emerald-700 text-white px-5 py-3 md:py-2 font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
                aria-label="Create 7-day plan"
              >
                {loadingPlan ? 'Creating…' : 'Create 7-Day Plan'}
              </button>
            </div>
          </div>
        )}

        {/* Plan */}
        {plan && plan.length > 0 && (
          <section id="plan-section" className="mt-8 md:mt-10">
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-3 md:mb-4">
              Your 7-Day Plan
            </h2>

            <div className="space-y-3 md:space-y-4">
              {plan.map((d) => {
                const lastIdx = d.items.length - 1;
                return (
                  <div key={d.day} className="bg-[#F8F5EF] border border-[#EEE7DC] rounded-xl p-3 md:p-4">
                    <div className="font-semibold text-slate-800 mb-2 text-sm md:text-base">
                      Day {d.day}
                    </div>
                    <ul className="space-y-1">
                      {d.items.map((line, idx) => {
                        const isQuestion = /[?]$/.test(line) || /^(What|How)/i.test(line);
                        const cls =
                          idx === lastIdx && isQuestion
                            ? 'italic text-slate-700 text-sm md:text-base'
                            : 'text-slate-700 text-sm md:text-base';
                        return (
                          <li key={idx} className={cls}>
                            {line}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Actions for plan */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={copyPlan}
                className="rounded-lg border border-[#E5DACA] bg-white px-4 py-2 hover:bg-[#F4EFE8] focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                Copy plan
              </button>
              <button
                onClick={downloadPlan}
                className="rounded-lg border border-[#E5DACA] bg-white px-4 py-2 hover:bg-[#F4EFE8] focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                Download .txt
              </button>
            </div>

            {/* Debug raw */}
            {/* <pre className="mt-4 text-xs text-slate-500 whitespace-pre-wrap">{planRaw}</pre> */}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
