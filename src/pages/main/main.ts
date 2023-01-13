import { Loader } from './components/loader/loader';
import { DrawMain } from './components/draw/draw';
import { Filter } from './components/filters/filter';
import { IProduct } from '../types/types';
import { Sort } from './components/sort/sort';
import { AllFiltersType } from '../types/types';
import { allFilters, syncURL } from './components/forQueryParam/forQueryParam';
import { Search } from './components/search/search';
import { copyLink } from './components/copyLink/copyLink';
import { typeOfView } from './components/typeOfView/typeOfView';

export class Main {
  drawMain: DrawMain;
  loader: Loader;
  filter: Filter;
  filtredData: IProduct[];
  allFilters: AllFiltersType;
  sort: Sort;
  data: IProduct[];
  search: Search;
  copyLink: copyLink;
  typeOfView: typeOfView;
  mainBlock: HTMLElement;

  constructor() {
    this.loader = new Loader('assets/data/data.json');
    this.filter = new Filter();
    this.drawMain = new DrawMain();
    this.filtredData = [];
    this.sort = new Sort();
    this.search = new Search();
    this.copyLink = new copyLink();
    this.typeOfView = new typeOfView();
    this.allFilters = allFilters;
    this.data = [];
    this.mainBlock = document.body;
  }

  async createPage() {
    this.mainBlock.id = 'main-page';
    let sum = 0,
      stock = 0;
    if (localStorage.getItem('total-header') !== null) {
      sum = Number(localStorage.getItem('total-header'));
    }
    if (localStorage.getItem('arrayOfId') === '') {
      localStorage.removeItem('arrayOfId');
    }
    if (localStorage.getItem('arrayOfId') !== null) {
      stock = Number(localStorage.getItem('arrayOfId')?.split(',').length);
    }
    (document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML = sum.toString();
    const inCart = document.getElementById('found');
    if (inCart) {
      inCart.innerHTML = stock.toString();
      localStorage.setItem('inCart', inCart.innerText);
    }
    (this.mainBlock.querySelector('.main') as HTMLElement).innerHTML = `
      <div class="container">
        <div class="main__wrapper">
          <div class="main__aside aside">
            <div class="aside__filters filters">
            </div>
          </div>
          <div class="main__catalog catalog">
            <div class="catalog__panel">
              <div class="catalog__search search">
                <form class="search__form">
                  <input maxlength="15" type="search" placeholder="Search product" value="" class="search__input">
                </form>
              </div>
              <div class="catalog__clear clear">
                <div class="clear-btn _hover">Clear Filters</div>
              </div>
              <div class="catalog__copy copy">
                <button class="copy__btn">Copy Link</button>
              </div>
              <div class="catalog__sort sort">
                <button class="sort__button">
                  <p class="sort__text">Choose Sort</p>
                </button>
              </div>
              <div class="catalog__typeView typeView">
                <button class="typeView__icon">≡</button>
              </div>
              <div class="sort__chooseList chooseList">
                <form class="chooseList__form">
                  <div class="chooseList__typeSort">
                    <input type="radio" id="popularityUp" name="sortList">
                    <label for="popularityUp">By popularity(Ascending)</label>
                  </div>
                  <div class="chooseList__typeSort">
                    <input type="radio" id="popularityLow" name="sortList">
                    <label for="popularityLow">By popularity(Descending)</label>
                  </div>
                  <div class="chooseList__typeSort">
                    <input type="radio" id="priceUp" name="sortList">
                    <label for="priceUp">By price(Ascending)</label>
                  </div>
                  <div class="chooseList__typeSort">
                    <input type="radio" id="priceLow" name="sortList">
                    <label for="priceLow">By price(Descending)</label>
                  </div>
                </form>
              </div>
            </div>
            <div class="catalog__products"></div>
          </div>
        </div>
      </div>`;
  }

  async start(): Promise<void> {
    const data = await this.loader.load();
    if (
      window.location.href !== 'https://online-shop-sqwezzy-ich-kirich.netlify.app/' &&
      window.location.href !== 'https://online-shop-sqwezzy-ich-kirich.netlify.app/index.html'
    ) {
      const searchClear = location.search.split('');
      searchClear.shift();
      const queryParamsString = searchClear.join('').toString();
      const paramsObject: AllFiltersType = JSON.parse(
        '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
      );
      this.allFilters = paramsObject;
    }
    await this.filter.start(data, this.filtredData);
    await this.drawMain.draw(data);
    await this.sort.addSortEventListeners();
    await this.search.addSearchEventListeners();
    await this.copyLink.addEventListenerToCopyBtn();
    await this.typeOfView.addEventListenerButtonView();
    this.filter.filter();
    const buttonClear = document.querySelector('.clear-btn') as HTMLSelectElement;
    buttonClear.addEventListener('click', () => {
      syncURL(allFilters);
      this.filter.start(data, this.filtredData);
      this.drawMain.draw(data);
      this.filter.filter();
      localStorage.setItem('category', '');
      localStorage.setItem('brand', '');
      (document.querySelector('.typeView__icon') as HTMLElement).innerHTML = '≡';
      (document.querySelector('.sort__text') as HTMLElement).innerHTML = 'Choose Sort';
    });
  }

  async render(): Promise<void> {
    const data: IProduct[] = await this.loader.load();
    let filtredData: IProduct[] = data;
    const popstate = (event: PopStateEvent) => {
      if (location.hash !== '' && location.hash !== 'main-page') {
        window.removeEventListener('popstate', popstate);
        location.search = '';
      } else {
        if (event.state !== null) {
          if (event.state.category) {
            filtredData = this.filter.filterArrayByCategory(data, event.state.category);
            filtredData = this.filter.filterArrayByBrand(filtredData, event.state.brand);
          } else filtredData = data;

          if (event.state.brand) {
            filtredData = this.filter.filterArrayByBrand(data, event.state.brand);
            filtredData = this.sort.sort(event.state.type, filtredData);
          }
          if (event.state.type === '') {
            filtredData = this.sort.sort('By popularity(Ascending)', filtredData);
          } else filtredData = this.sort.sort(event.state.type, filtredData);

          if (event.state.price) filtredData = this.filter.filterByPrice(filtredData, event.state.price);
          if (event.state.stock) filtredData = this.filter.filterByStock(filtredData, event.state.stock);
          if (event.state.type && this.filtredData.length > 0 && event.state.category) {
            event.state.category = localStorage.getItem('category');
            filtredData = this.filter.filterArrayByCategory(this.data, event.state.category);
            filtredData = this.sort.sort(event.state.type, filtredData);
          }

          if (event.state.search) filtredData = this.search.searchProducts(filtredData, event.state.search);
          if (filtredData.length === 0 && event.state.search === '') filtredData = data;
          this.drawMain.draw(filtredData);
          this.filter.start(this.data, filtredData, event.state);
          this.filter.filter(event.state);
        }
      }
    };
    window.addEventListener('popstate', popstate);
  }

  async onload(): Promise<void> {
    const data: IProduct[] = await this.loader.load();
    this.data = data;
    let filtredData: IProduct[];
    if (
      window.location.href !== `https://online-shop-sqwezzy-ich-kirich.netlify.app/` &&
      window.location.href !== `https://online-shop-sqwezzy-ich-kirich.netlify.app/index.html` &&
      window.location.href !== `https://online-shop-sqwezzy-ich-kirich.netlify.app/?${window.location.hash}` &&
      window.location.href !== `https://online-shop-sqwezzy-ich-kirich.netlify.app/index.html?${window.location.hash}`
    ) {
      const searchClear = location.search.split('');
      searchClear.shift();
      const queryParamsString = searchClear.join('').toString();
      const paramsObject = JSON.parse(
        '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
      );
      localStorage.setItem('category', paramsObject.category);
      filtredData = data;
      if (paramsObject.category) {
        filtredData = this.filterByCategoryOnload(paramsObject.category, data, paramsObject);
      }
      if (paramsObject.brand) {
        filtredData = this.filter.filterArrayByBrand(data, paramsObject.brand);
      }
      if (paramsObject.category) {
        filtredData = this.filter.filterArrayByBrand(filtredData, paramsObject.brand);
      }
      if (paramsObject.type) {
        filtredData = this.sort.sort(paramsObject.type, filtredData);
      }
      if (paramsObject.search) {
        filtredData = this.search.searchProducts(filtredData, paramsObject.search);
      }
      this.filtredData = filtredData;
      if (filtredData !== undefined) {
        this.drawMain.draw(filtredData);
        this.filter.start(data, filtredData, this.allFilters);
        this.filter.filter(this.allFilters);
      } else this.drawMain.draw(data);
    }
  }

  async init() {
    await this.createPage();
    await this.start();
    await this.onload();
    await this.render();
    const btn = document.querySelector('.logo__home');
    btn?.addEventListener('click', () => {
      localStorage.clear();
    });
  }

  filterByCategoryOnload(category: string, data: IProduct[], paramsObject: AllFiltersType): IProduct[] {
    if (category !== undefined) {
      let categorySerch: string[] = location.search.split('&br');
      categorySerch = categorySerch[0].split('ory=');
      localStorage.setItem('category', categorySerch[1]);
      const filterByParamsObject: string[] = paramsObject.category.split('%2C').filter((el: string) => {
        return el;
      });
      const filtredArrayOfProd = data.filter((item) => {
        let haveItemCategory: boolean = false;
        for (let i = 0; i < filterByParamsObject.length; i++) {
          if (item.category === filterByParamsObject[i]) {
            haveItemCategory = true;
          }
        }
        if (haveItemCategory) return true;
      });
      return filtredArrayOfProd;
    }
    return data;
  }
}
