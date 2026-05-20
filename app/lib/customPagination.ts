import { ApiInfo } from "./api/rickMorty/rickMorty.types";

const PAGE_SIZE = 10;
const API_PAGE_SIZE = 20;
const RATIO = API_PAGE_SIZE / PAGE_SIZE;

export function toApiPage(localPage: number): number {
  return Math.ceil(localPage / RATIO);
}

export function sliceForPage<T>(items: T[], localPage: number): T[] {
  const offset = ((localPage - 1) % RATIO) * PAGE_SIZE;
  return items.slice(offset, offset + PAGE_SIZE);
}

export function buildLocalInfo(apiInfo: ApiInfo, localPage: number): ApiInfo {
  const pages = Math.ceil(apiInfo.count / PAGE_SIZE);
  return {
    count: apiInfo.count,
    pages,
    next: localPage < pages ? "1" : null,
    prev: localPage > 1 ? "1" : null,
  };
}
