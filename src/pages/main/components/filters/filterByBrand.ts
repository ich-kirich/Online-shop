import { IProduct } from '../../../types/types';
import { AllFiltersType } from '../../../types/types';
import { syncURL } from '../forQueryParam/forQueryParam';

export class FilterBrand {
  uploadFilter(): void {
    const filters = document.querySelector('.filters') as HTMLElement;
    filters.innerHTML = '';
    const filtersTitle = document.createElement('div');
    filtersTitle.className = 'filters__main-title';
    filtersTitle.innerHTML = 'Filters:';
    filters.append(filtersTitle);
  }

  async drawFilter(data: IProduct[], filtredData?: IProduct[]): Promise<void> {
    let brandsArray: string[] = data.map((item) => item.brand);
    const filters = document.querySelector('.filters') as HTMLElement;
    const filter = document.createElement('div') as HTMLElement;
    const title = document.createElement('div') as HTMLElement;
    const btnShowAll = document.createElement('div') as HTMLElement;
    const form = document.createElement('form') as HTMLFormElement;
    brandsArray = brandsArray.filter((element, index) => {
      return brandsArray.indexOf(element) === index;
    });
    title.className = 'filters__title';
    title.innerHTML = 'Brand';
    form.className = 'form';
    btnShowAll.className = 'filters__btn';
    btnShowAll.classList.add('filters__btn-brand');
    btnShowAll.id = 'brand-btn';
    btnShowAll.innerHTML = 'Show all';
    if (localStorage.getItem('showAllBrands') === 'true') {
      filter.style.height = 'auto';
      btnShowAll.classList.toggle('_active');
      localStorage.setItem('showAllBrands', 'true');
    }
    filter.className = 'filters__filter';
    filter.classList.add('filters__brand');
    filter.append(title);
    filter.append(btnShowAll);

    brandsArray.forEach((brand) => {
      let counter: number = 0;
      let allCount: number = 0;
      const inputRow = document.createElement('div') as HTMLElement;
      inputRow.className = 'filters__input-row';
      inputRow.classList.add('filters__input-row-brand');
      data.forEach((el) => {
        if (el.brand === brand) {
          allCount++;
        }
      });

      if (localStorage.getItem('brand') == null) counter = allCount;
      if (localStorage.getItem('brand') !== null) {
        filtredData?.forEach((el) => {
          if (el.brand === brand) {
            counter++;
          }
        });
      }
      if (
        localStorage.getItem('category') ||
        localStorage.getItem('rightPriceValue') ||
        localStorage.getItem('leftPriceValue') ||
        localStorage.getItem('leftStockValue') ||
        localStorage.getItem('rightStockValue')
      ) {
        counter = 0;
        filtredData?.forEach((el) => {
          if (el.brand === brand) {
            counter++;
          }
        });
      }

      inputRow.innerHTML = `
                            <input type="checkbox" id="${brand}" name='brand'>
                            <label for="${brand}">${brand}
                            </label><span class="filters__counter">${counter}/${allCount}</span>`;
      if (counter === 0) {
        inputRow.classList.add('row-null');
      }
      if (localStorage.getItem('category') !== '' && inputRow.classList.contains('row-null')) {
        filtredData?.forEach((el) => {
          if (el.brand !== brand) {
            inputRow.classList.add('row-disable');
          }
        });
      }
      form?.append(inputRow);
    });
    filter.append(form);
    filters.append(filter);
    this.openAllFilters();
  }

  drawChekedInput(allFiltersOnload?: AllFiltersType): void {
    const filterRow = document.querySelectorAll('.filters__input-row-brand');
    let arrayFromBrand;
    if (allFiltersOnload?.brand !== '') {
      arrayFromBrand = allFiltersOnload?.brand.split('%2C');
      const filtredArrayOfBrand = arrayFromBrand?.filter((element) => {
        return element !== '';
      });
      filterRow.forEach((item) => {
        const input = item.children[0] as HTMLInputElement;
        filtredArrayOfBrand?.forEach((el) => {
          if (el === input.id) {
            item.children[1].classList.toggle('cheked');
            input.checked = true;
          }
        });
      });
    }
  }

  checkFilter(allFiltersOnload?: AllFiltersType): void {
    const filterRow = document.querySelectorAll('.filters__input-row-brand');
    filterRow.forEach((item) => {
      const input = item.children[0] as HTMLInputElement;
      input.addEventListener('change', function () {
        if (input.checked) {
          const localStorageBrand = localStorage.getItem('brand');
          const searchClear = location.search.split('');
          searchClear.shift();
          const queryParamsString = searchClear.join('').toString();
          let paramsObject;
          if (queryParamsString !== '') {
            paramsObject = JSON.parse(
              '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
            );
          }
          if (paramsObject !== undefined) {
            if (localStorageBrand) {
              paramsObject.brand = localStorageBrand;
            }
            if (paramsObject.brand.indexOf(input.id) === -1) {
              paramsObject.brand += `%2C${input.id}`;
            }
            localStorage.setItem('brand', paramsObject.brand);
            syncURL(paramsObject);
            item.children[1].classList.toggle('cheked');
          }
        } else {
          const searchClear = location.search.split('');
          searchClear.shift();
          const queryParamsString = searchClear.join('').toString();
          let paramsObject;
          if (queryParamsString !== '') {
            paramsObject = JSON.parse(
              '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
            );
          }
          if (paramsObject !== undefined) {
            let arrayFromBrand = paramsObject.brand.split('%2C');
            if (allFiltersOnload !== undefined) {
              arrayFromBrand = allFiltersOnload.brand.split('%2C');
            }
            const filtredArrayOfBrand = arrayFromBrand.filter((element: string) => {
              return element !== input.id && element !== '';
            });
            paramsObject.brand = '%2C' + filtredArrayOfBrand.toString().replace(/,/g, '%2C');
            if (paramsObject.brand === '%2C') paramsObject.brand = '';
            syncURL(paramsObject);
            localStorage.setItem('brand', paramsObject.brand);
            item.children[1].classList.toggle('cheked');
          }
        }
      });
    });
  }

  openAllFilters() {
    const btn = document.getElementById('brand-btn') as HTMLElement;
    const filter = document.querySelector('.filters__brand') as HTMLElement;
    btn?.addEventListener('click', () => {
      btn.classList.toggle('_active');
      if (btn.classList.contains('_active')) {
        filter.style.height = 'auto';
        localStorage.setItem('showAllBrands', 'true');
      } else {
        filter.style.height = '180px';
        localStorage.setItem('showAllBrands', 'false');
      }
    });
  }
}
