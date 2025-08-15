import api from "../lib/api";

export type Mood = {
  id: number;
  date: string;
  score: number;
  note?: string;
};

function normalize(raw:any){
  return {
    id: raw.id,
    date: raw.date ?? raw.entryDate ?? "",
    score: raw.moodScore ?? raw.score ?? raw.mood ?? 3,
    note: raw.note ?? raw.description ?? undefined,
  } as Mood;
}

export async function getMoodsRange(params: { start: string; end: string }): Promise<Mood[]> {
  const { data } = await api.get("/api/moods/range", { params });
  const list = Array.isArray(data) ? data : (data?.content ?? []);
  return list.map(normalize);
}

export async function createMood(body: { date: string; score: number; note?: string }) {
  const payload = { date: body.date, moodScore: body.score, note: body.note };
  const res = await api.post("/api/moods/create", payload);

  if (res.data) return normalize(res.data);
  return;
}

export async function updateMood(
  id: number | null,
  body: { date: string; score?: number; note?: string }
){
  const payload = {
    date: body.date,
    ...(typeof body.score === "number" ? { moodScore: body.score } : {}),
    ...(typeof body.note  !== "undefined" ? { note: body.note } : {}),
  };

  const url = id != null ? `/api/moods/update/${id}` : `/api/moods/update`;
  const res = await api.put(url, payload);
  return res.data ? normalize(res.data) : undefined;
}

export async function deleteMood(id: number) {
  await api.delete(`/api/moods/delete?id=${id}`);
}

