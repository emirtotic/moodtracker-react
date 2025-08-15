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

// ⬇⬇⬇ ovde menjamo endpoint na /api/moods/create
export async function createMood(body: { date: string; score: number; note?: string }) {
  const payload = { date: body.date, moodScore: body.score, note: body.note };
  const res = await api.post("/api/moods/create", payload);

  // Ako backend vrati objekat — normalizuj, inače pusti da Dashboard uradi reload posle onSaved()
  if (res.data) return normalize(res.data);
  return;
}

export async function updateMood(
  id: number | null,               // ako ti endpoint ne traži id u path-u, prosledi null
  body: { date: string; score?: number; note?: string }
){
  const payload = {
    date: body.date,                          // obavezno
    ...(typeof body.score === "number" ? { moodScore: body.score } : {}),
    ...(typeof body.note  !== "undefined" ? { note: body.note } : {}),
  };

  // izaberi URL u zavisnosti od backend-a
  const url = id != null ? `/api/moods/update/${id}` : `/api/moods/update`;
  const res = await api.put(url, payload);
  return res.data ? normalize(res.data) : undefined;
}

export async function deleteMood(id: number) {
  await api.delete(`/api/moods/delete?id=${id}`);
}

