import { IProduct } from '../../../types/types';
import { allFilters, syncURL } from '../forQueryParam/forQueryParam';

export class Search {

    async addSearchEventListeners(): Promise<void>{ 
        const searchInput = document.querySelector('.search__input') as HTMLSelectElement;
        this.updateSearch(searchInput);
        searchInput.addEventListener('input', ()=>{
            const searchClear = location.search.split('');
            searchClear.shift();
            const queryParamsString = searchClear.join('').toString();
            let paramsObject;
            if(queryParamsString !== '') {
                paramsObject = JSON.parse(
                    '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
                  );
            }
            if(paramsObject !== undefined){
                if(paramsObject.search !== undefined){
                    paramsObject.search = searchInput.value;
                    syncURL(paramsObject);
                }
            }
        })
    }

    updateSearch(searchInput: HTMLSelectElement){
        const searchClear = location.search.split('');
        searchClear.shift();
        const queryParamsString = searchClear.join('').toString();
        let paramsObject;
        if(queryParamsString !== '') {
            paramsObject = JSON.parse(
                '{"' + decodeURI(queryParamsString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
              );
        }
        if(paramsObject !== undefined){
            if(paramsObject.search !== undefined){
                searchInput.value = paramsObject.search;
                syncURL(paramsObject);
            }
        }
        else {
            syncURL(allFilters);
        }
    }

    searchProducts (data: IProduct[], searchText: string){
        const searchData: IProduct[] = [];
        if(searchText === ''){
            return data;
        }
        data.forEach((item) => {
            if(item.title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
            else if(item.description.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
            else if(item.price.toString().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
            else if(item.rating.toString().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
            else if(item.stock.toString().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
            else if(item.brand.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
            else if(item.category.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
                searchData.push(item)
            }
        });
        return searchData;
    }
}