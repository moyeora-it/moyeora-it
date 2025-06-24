export type Page<T> = {
  status: {code:number, message:string, success:boolean},
  data?:T[],
  items?:T[],
  hasNext: boolean,
  cursor: number | null
};

export default function flattenPages<T>(pages: Page<T>[]) {
  return pages.length ? pages.flatMap((page) => page.data || page.items || []) : [];
}
