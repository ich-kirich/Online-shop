import { AllFiltersType } from '../../../types/types';

export const allFilters: AllFiltersType = {
  category: '',
  brand: '',
  price: '',
  stock: '',
  search: '',
  type: '',
  view: 'blocks',
};
const category = localStorage.getItem('category');
if(category !== null){
  allFilters.category = category;
}

function transformToURLParams(filters: AllFiltersType) {
  const query = Object.entries(filters)
      .map(([key, value]) => {
      return `${key}=${value}`;
      })
      .join('&');
  return `?${query}`;
}
export function syncURL(filters: AllFiltersType) {
  const path = document.location.pathname;
  const query = transformToURLParams(filters);
  window.history.pushState(filters, '', `${path}${query}`);
  window.history.pushState(filters, '', `${path}${query}`);
  history.back();
}