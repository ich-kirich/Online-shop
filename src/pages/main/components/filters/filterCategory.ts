import { IProduct, AllFiltersType } from '../../../types/types';
import { syncURL } from '../forQueryParam/forQueryParam';

export class FilterCategory {
  uploadFilter(): void {
    const filters = document.querySelector('.filters') as HTMLElement;
    filters.innerHTML = '';
    const filtersTitle = document.createElement('div');
    filtersTitle.className = 'filters__main-title';
    filtersTitle.innerHTML = 'Filters:';
    filters.append(filtersTitle);
  }

  async drawFilter(data: IProduct[], filtredData?: IProduct[]): Promise<void> {
    let categoryArray: string[] = data.map((item) => item.category);
    const filters = document.querySelector('.filters') as HTMLElement;
    const filter = document.createElement('div') as HTMLElement;
    const title = document.createElement('div') as HTMLElement;
    const btnShowAll = document.createElement('div') as HTMLElement;
    const form = document.createElement('form') as HTMLFormElement;
    this.openAllFilters();
    categoryArray = categoryArray.filter((element, index) => {
      return categoryArray.indexOf(element) === index;
    });

    this.uploadFilter();
    filter.className = 'filters__filter';
    title.className = 'filters__title';
    title.innerHTML = 'Category';
    form.className = 'form';
    btnShowAll.className = 'filters__btn';
    btnShowAll.innerHTML = 'Show all';

    if (localStorage.getItem('showAllCategories') === 'true') {
      filter.style.height = 'auto';
      btnShowAll.classList.toggle('_active');
      localStorage.setItem('showAllCategories', 'true');
    }

    filter.append(title);
    filter.append(btnShowAll);
    filter.append(form);

    categoryArray.forEach((category) => {
      let counter: number = 0;
      const inputRow = document.createElement('div') as HTMLElement;
      inputRow.className = 'filters__input-row';
      inputRow.classList.add('filters__input-row-category');

      if (filtredData !== undefined && filtredData.length < 1) {
        counter = 5;
      } else if (localStorage.getItem('category') === '') {
        counter = 5;
      } else if (localStorage.getItem('category') !== '') {
        filtredData?.forEach((el) => {
          if (el.category === category) {
            counter++;
          }
        });
      }

      if (
        localStorage.getItem('brand') ||
        localStorage.getItem('rightPriceValue') !== '' ||
        localStorage.getItem('leftPriceValue') !== '' ||
        localStorage.getItem('leftStockValue') !== '' ||
        localStorage.getItem('rightStockValue') !== ''
      ) {
        counter = 0;
        filtredData?.forEach((el) => {
          if (el.category === category) {
            counter++;
          }
        });
      }

      inputRow.innerHTML = `
                            <input type="checkbox" id="${category}" name='category'>
                            <label for="${category}">${category}
                            </label><span class="filters__counter">${counter}/5</span>`;
      if (counter === 0) {
        inputRow.classList.add('row-null');
      }

      if (
        localStorage.getItem('brand') !== '' &&
        localStorage.getItem('brand') !== null &&
        inputRow.classList.contains('row-null')
      ) {
        filtredData?.forEach((el) => {
          if (el.category !== category) {
            inputRow.classList.add('row-disable');
          }
        });
      }
      form?.append(inputRow);
    });
    filters?.append(filter);
  }

  checkFilter(allFiltersOnload?: AllFiltersType): void {
    const filterRow = document.querySelectorAll('.filters__input-row-category');
    filterRow.forEach((item) => {
      const input = item.children[0] as HTMLInputElement;
      input.addEventListener('change', function () {
        if (input.checked) {
          const localStorageCategory = localStorage.getItem('category');
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
            if (localStorageCategory) {
              paramsObject.category = localStorageCategory;
            }
            if (paramsObject.category.indexOf(input.id) === -1) {
              paramsObject.category += `%2C${input.id}`;
            }
            localStorage.setItem('category', paramsObject.category);
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
            let arrayFromCategory = paramsObject.category.split('%2C');
            if (allFiltersOnload !== undefined) {
              arrayFromCategory = allFiltersOnload.category.split('%2C');
            }
            const filtredArrayOfCategory = arrayFromCategory.filter((element: string) => {
              return element !== input.id && element !== '';
            });
            paramsObject.category = '%2C' + filtredArrayOfCategory.toString().replace(/,/g, '%2C');
            if (paramsObject.category === '%2C') paramsObject.category = '';
            syncURL(paramsObject);
            localStorage.setItem('category', paramsObject.category);
            item.children[1].classList.toggle('cheked');
          }
        }
      });
    });
  }

  drawChekedInput(allFiltersOnload?: AllFiltersType): void {
    const filterRow = document.querySelectorAll('.filters__input-row-category');
    let arrayFromCategory;
    if (allFiltersOnload?.category !== '') {
      arrayFromCategory = allFiltersOnload?.category.split('%2C');
      const filtredArrayOfCategory = arrayFromCategory?.filter((element) => {
        return element !== '';
      });
      filterRow.forEach((item) => {
        const input = item.children[0] as HTMLInputElement;
        filtredArrayOfCategory?.forEach((el) => {
          if (el === input.id) {
            item.children[1].classList.toggle('cheked');
            input.checked = true;
          }
        });
      });
    }
  }

  openAllFilters() {
    const btn = document.querySelector('.filters__btn') as HTMLElement;
    const filter = document.querySelector('.filters__filter') as HTMLElement;
    btn?.addEventListener('click', () => {
      btn.classList.toggle('_active');
      if (btn.classList.contains('_active')) {
        filter.style.height = 'auto';
        localStorage.setItem('showAllCategories', 'true');
      } else {
        filter.style.height = '180px';
        localStorage.setItem('showAllCategories', 'false');
      }
    });
  }
}
