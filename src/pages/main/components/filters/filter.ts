import { FilterCategory } from './filterCategory';
import { IProduct, AllFiltersType } from '../../../types/types';
import { FilterBrand } from '../filters/filterByBrand';
import { FilterPrice } from './filterByPrice';
import { FilterStock } from './filterByStock';

export class Filter {
  filterCategory: FilterCategory;
  filterBrand: FilterBrand;
  filterPrice: FilterPrice;
  filterStock: FilterStock;
  constructor() {
    this.filterCategory = new FilterCategory();
    this.filterBrand = new FilterBrand();
    this.filterPrice = new FilterPrice();
    this.filterStock = new FilterStock();
  }
  async start(data: IProduct[], filtredData?: IProduct[], allFilters?: AllFiltersType) {
    this.filterCategory.drawFilter(data, filtredData);
    this.filterBrand.drawFilter(data, filtredData);
    this.filterPrice.drawFilter();
    this.filterStock.drawFilter();
    this.filterCategory.drawChekedInput(allFilters);
    this.filterBrand.drawChekedInput(allFilters);
  }
  filter(allFiltersOnload?: AllFiltersType) {
    this.filterCategory.checkFilter(allFiltersOnload);
    this.filterBrand.checkFilter(allFiltersOnload);
    this.filterStock.checkFilter();
    this.filterPrice.checkFilter();
    this.filterCategory.openAllFilters();
  }
  filterArrayByCategory(data: IProduct[], eventStateCategory: string): IProduct[] {
    if (eventStateCategory !== undefined) {
      const filterByCategoryArr: string[] = eventStateCategory.split('%2C').filter((el: string) => {
        return el !== '';
      });
      const filtredArrayOfProd = data.filter((item) => {
        let haveItemCategory: boolean = false;
        for (let i = 0; i < filterByCategoryArr.length; i++) {
          if (item.category === filterByCategoryArr[i]) {
            haveItemCategory = true;
          }
        }
        if (haveItemCategory) return true;
      });
      return filtredArrayOfProd;
    }
    return data;
  }
  filterArrayByBrand(data: IProduct[], eventStateBrand: string): IProduct[] {
    if (eventStateBrand !== '') {
      const filterBrandArr: string[] = eventStateBrand.split('%2C').filter((el: string) => {
        return el !== '';
      });
      const filtredArrayOfProd = data.filter((item) => {
        let haveItemBrand: boolean = false;
        for (let i = 0; i < filterBrandArr.length; i++) {
          if (item.brand === filterBrandArr[i]) haveItemBrand = true;
        }
        if (haveItemBrand) return true;
      });
      if (this.filterArrayByBrand.length) return filtredArrayOfProd;
    }
    return data;
  }
  filterByPrice(data: IProduct[], eventStatePrice: string): IProduct[] {
    if (eventStatePrice) {
      const filterBrandArr: string[] = eventStatePrice
        .split('%2C')
        .toString()
        .split(',')
        .filter((el: string) => {
          return el !== '';
        });
      const filtredArrayOfProd = data.filter((item) => {
        let isItemTrue: boolean = false;
        if (item.price >= Number(filterBrandArr[0]) && item.price <= Number(filterBrandArr[1])) isItemTrue = true;
        if (isItemTrue) {
          return true;
        }
      });
      if (filterBrandArr.length) return filtredArrayOfProd;
    }
    return data;
  }
  filterByStock(data: IProduct[], eventStateStock: string): IProduct[] {
    if (eventStateStock) {
      const filterBrandArr: string[] = eventStateStock
        .split('%2C')
        .toString()
        .split(',')
        .filter((el: string) => {
          return el !== '';
        });
      const filtredArrayOfProd = data.filter((item) => {
        let isItemTrue: boolean = false;
        if (item.stock >= Number(filterBrandArr[0]) && item.stock <= Number(filterBrandArr[1])) isItemTrue = true;
        if (isItemTrue) {
          return true;
        }
      });
      if (filterBrandArr.length) return filtredArrayOfProd;
    }
    return data;
  }
  checkRangeFilters(array: IProduct[]):void{
    const priceArray = array.map(x=>x.price);
    const stockArray = array.map(x=>x.stock);

    const maxPrice = Math.max(...priceArray);
    const minPrice = Math.min(...priceArray);
    const maxStock = Math.max(...stockArray);
    const minStock = Math.min(...stockArray);

    localStorage.setItem('leftPriceValue', minPrice.toString());
    localStorage.setItem('rightPriceValue', maxPrice.toString());
    localStorage.setItem('leftStockValue', minStock.toString());
    localStorage.setItem('rightStockValue', maxStock.toString());
  }
}
