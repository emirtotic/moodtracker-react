import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MoodForm from '../components/MoodForm';
import MoodCard from '../components/MoodCard';

import {
  getMoodsRange,
  deleteMood,
  updateMood,
  type Mood,
} from '../services/moods';

export default function Dashboard() {
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10));
  const [sort, setSort] = useState<'asc' | 'desc'>('desc'); // UI-only; backend ne prima sort
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMoodsRange({ start: from, end: to });
      // UI sort (po datumu)
      const sorted = [...data].sort((a, b) =>
        sort === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMoods(sorted);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to load moods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaved = () => load();

  const onDelete = async (id: number) => {
    if (confirm('Delete this mood?')) {
      await deleteMood(id);
      await load();
    }
  };

  const onEdit = async (m: Mood) => {
    const note = prompt('Edit note', m.note ?? '') ?? m.note;
    const score = Number(prompt('Edit mood (1-5)', String(m.score)) ?? m.score);

    await updateMood(
      m.id, // ili null ako endpoint ne koristi id u path-u
      { date: m.date, note: note ?? undefined, score }
    );
    await load();
  };

  // utišavanje lint-a
  useMemo(() => ({ from, to, sort }), [from, to, sort]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto pt-10 pb-8 px-4 text-center">
          <div className="mx-auto h-16 w-16 rounded-full overflow-hidden bg-slate-300">
            <img
              src="https://thumbs.dreamstime.com/b/mental-health-psychology-concept-vector-icon-logo-design-human-anatomical-brain-shape-green-tree-tender-118777815.jpg"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mt-6">
            How are you feeling today?
          </h1>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Track your emotional journey with mindful awareness and gentle reflection
          </p>
        </section>

        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-8">
          <div>
            <MoodForm onSaved={onSaved} />
          </div>

          <div>
            {/* Responsive filter toolbar */}
            <div className="grid grid-cols-2 gap-3 md:flex md:items-end md:gap-3 mb-3">
              <div className="col-span-1">
                <label className="block text-xs md:text-sm text-slate-700 mb-1">From</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DACA] bg-white p-2.5 md:p-3 text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs md:text-sm text-slate-700 mb-1">To</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DACA] bg-white p-2.5 md:p-3 text-sm"
                />
              </div>
              <div className="col-span-2 md:col-auto">
                <label className="block text-xs md:text-sm text-slate-700 mb-1">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
                  className="w-full md:w-40 rounded-lg border border-[#E5DACA] bg-white p-2.5 md:p-3 text-sm"
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="col-span-2 md:col-auto h-11 md:h-12 px-4 rounded-lg bg-emerald-600 text-white mt-1 md:mt-5 w-full md:w-auto disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Apply'}
              </button>
            </div>

            <div className="space-y-3">
              {loading && <div className="text-slate-500">Loading…</div>}
              {!loading && moods.length === 0 && (
                <div className="text-slate-500">No moods in this range.</div>
              )}
              {!loading &&
                moods.map((m) => (
                  <MoodCard
                    key={m.id}
                    // adapter za MoodCard koji očekuje {entryDate, moodScore, note}
                    e={{ id: m.id, entryDate: m.date, moodScore: m.score, note: m.note }}
                    onEdit={() => onEdit(m)}
                    onDelete={onDelete}
                  />
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
