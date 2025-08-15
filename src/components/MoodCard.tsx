import { moodEmoji, moodLabel } from './Emoji';
import type { MoodEntry } from '../types';
export default function MoodCard({ e, onEdit, onDelete }:{ e:MoodEntry; onEdit:(e:MoodEntry)=>void; onDelete:(id:number)=>void }){
  const date = new Date(e.entryDate + 'T00:00:00');
  return (
    <div className="bg-[#F8F5EF] border border-[#EEE7DC] rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{moodEmoji(e.moodScore)}</div>
          <div>
            <div className="font-medium text-slate-800">{moodLabel(e.moodScore)}</div>
            <div className="text-xs text-slate-500">{date.toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <button title="Edit" onClick={()=>onEdit(e)} className="hover:text-slate-800">✏️</button>
          <button title="Delete" onClick={()=>onDelete(e.id)} className="hover:text-red-600">🗑️</button>
        </div>
      </div>
      {e.note && <div className="text-slate-700 mt-2">{e.note}</div>}
    </div>
  );
}