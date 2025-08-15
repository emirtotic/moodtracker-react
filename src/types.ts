export type User = { id:number; name:string; email:string };
export type LoginRes = { token:string; user:User };
export type MoodEntry = { id:number; entryDate:string; moodScore:number; note?:string };
export type Page<T> = { content:T[] } | T[];
export type AnalyzeRes = { average:number; summary:string; suggestions:string[] };