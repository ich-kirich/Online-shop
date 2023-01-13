import { AllFiltersType } from '../../../types/types';
import { syncURL } from '../forQueryParam/forQueryParam';
const wNumb = require('wnumb');
import * as noUiSlider from 'nouislider';

export class FilterPrice {
  priceSlider = document.querySelector('.filters__range-wrapper') as noUiSlider.target;

  drawFilter() {
    const filters = document.querySelector('.filters') as HTMLElement;
    const filter = document.createElement('div') as HTMLElement;
    const title = document.createElement('div') as HTMLElement;
    const counters = document.createElement('div') as HTMLElement;
    counters.className = 'counters';

    let leftValue: string | null = '10';
    let rightValue: string | null = '1749';
    if (localStorage.getItem('leftPriceValue') !== null) leftValue = localStorage.getItem('leftStockValue');
    if (localStorage.getItem('rightPriceValue') !== null) rightValue = localStorage.getItem('rightStockValue');
    counters.innerHTML = `<span class="range-counter" id="left-stock">${leftValue}$</span>
    <span class="range-counter" id="right-stock">${rightValue}$</span>`;

    const rangeWrapper = document.createElement('div') as noUiSlider.target;
    this.priceSlider = rangeWrapper;
    rangeWrapper.className = 'filters__range-wrapper';
    if (rangeWrapper) {
      noUiSlider.create(rangeWrapper, {
        start: [
          parseInt(localStorage.getItem('leftPriceValue') as string) || 10,
          parseInt(localStorage.getItem('rightPriceValue') as string) || 1749,
        ],
        connect: true,
        step: 1,
        range: {
          min: 10,
          max: 1749,
        },
        format: wNumb({
          decimals: 0,
        }),
      });
      rangeWrapper.noUiSlider?.on('update', function (values) {
        const leftValue: number | string = values[0];
        const rightValue: number | string = values[1];

        localStorage.setItem('leftPriceValue', leftValue.toString());
        localStorage.setItem('rightPriceValue', rightValue.toString());
        counters.innerHTML = `<span class="range-counter" id="left-stock">${leftValue}$</span>
                          <span class="range-counter" id="right-stock">${rightValue}$</span>`;
      });
    }
    filter.className = 'filters__filter';
    filter.classList.add('filters__price');
    title.className = 'filters__title';
    title.innerHTML = 'Price';
    filter.append(title);
    filter.append(rangeWrapper);
    filter.append(counters);
    filters.append(filter);
  }
  
  checkFilter(allFiltersOnload?: AllFiltersType) {
    const searchClear = location.search.split('');
    searchClear.shift();
    const queryParamsString = searchClear.join('').toString();
    const paramsObject = JSON.parse(
      '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
    );
    const minMaxPrice: string[] = paramsObject.price.split(',');
    localStorage.setItem('leftPriceValue', minMaxPrice[0]);
    localStorage.setItem('rightPriceValue', minMaxPrice[1]);

    this.priceSlider?.noUiSlider?.on('set', () => {
      const filterValues = [this.priceSlider.noUiSlider?.get()][0] as number[];
      const leftCount: string | number = filterValues[0];
      const rightCount: string | number = filterValues[1];
      paramsObject.price = `${leftCount},${rightCount}`;
      syncURL(paramsObject);
    });
  }
}
