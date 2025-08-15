import { useMemo, useState } from "react";
import { createMood } from "../services/moods";

const EMOJI: Record<number, { icon: string; label: string }> = {
  1: { icon: "😞", label: "Very bad" },
  2: { icon: "🙁", label: "Bad" },
  3: { icon: "😐", label: "Neutral" },
  4: { icon: "🙂", label: "Good" },
  5: { icon: "😊", label: "Happy" },
};

export default function MoodForm({ onSaved }: { onSaved: () => void }) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [moodScore, setMoodScore] = useState<number>(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const pick = useMemo(() => EMOJI[moodScore] ?? EMOJI[3], [moodScore]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!date) return setErr("Please choose a date.");
    if (moodScore < 1 || moodScore > 5) return setErr("Mood must be between 1 and 5.");
    if (note.length > 500) return setErr("Note is too long (max 500 characters).");

    setLoading(true);
    try {
      await createMood({ date, score: moodScore, note: note || undefined });
      setOk("Saved!");
      setNote("");
      setMoodScore(5);
      // ostavi izabrani datum; ako želiš, odkomentariši sledeću liniju da se resetuje na danas:
      // setDate(new Date().toISOString().slice(0, 10));
      onSaved();
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4EFE8] rounded-xl p-4 md:p-6 border border-[#EEE7DC]">
      <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-4">
        Record Your Daily Mood
      </h3>

      {/* Preview current selection */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{pick.icon}</div>
        <div className="text-slate-700 text-sm md:text-base">{pick.label}</div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs md:text-sm text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-[#E5DACA] bg-white p-2.5 md:p-3 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm text-slate-700 mb-1">
              Current Mood
            </label>
            <select
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E5DACA] bg-white p-2.5 md:p-3 text-sm md:text-base"
            >
              <option value={5}>Happy 😊</option>
              <option value={4}>Good 🙂</option>
              <option value={3}>Neutral 😐</option>
              <option value={2}>Bad 🙁</option>
              <option value={1}>Very bad 😞</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm text-slate-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind? How did this mood come about?"
            className="w-full rounded-lg border border-[#E5DACA] bg-white p-2.5 md:p-3 h-28 text-sm md:text-base"
            maxLength={500}
          />
          <div className="text-[11px] text-slate-500 mt-1 text-right">
            {note.length}/500
          </div>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}
        {ok && <div className="text-sm text-emerald-700">{ok}</div>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 text-white py-3 hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Mood Entry"}
        </button>
      </form>
    </div>
  );
}
