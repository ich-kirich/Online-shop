import { allFilters, syncURL } from '../forQueryParam/forQueryParam';
import { IProduct } from '../../../types/types';
export class Sort {

    async addSortEventListeners(): Promise<void>{
        const sortBlock = document.querySelector('.catalog__sort') as HTMLElement;
        const chooseList = document.querySelector('.sort__chooseList') as HTMLElement;
        const chooseOption = document.querySelectorAll('.chooseList__typeSort') as NodeListOf<Element>;
        this.updateNameSort();
        sortBlock.addEventListener('click', (event) => {
            chooseList.style.display = 'block';
        });
        document.addEventListener('click', function outDiv(e) {
            if(location.hash !== '' && location.hash !== 'main-page'){
                document.removeEventListener('click', outDiv);
            }
            if (e.target instanceof Element) { 
                if (!(document.querySelector('.catalog__sort') as HTMLSelectElement).contains(e.target)) {
                    chooseList.style.display = 'none';
                }
            }
        });
        chooseOption.forEach((item) => {
            item.addEventListener('click', function (e) {
                if (e.target instanceof Element) { 
                    if(item.getElementsByTagName('input')[0].checked){
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
                            if(paramsObject.type !== undefined){
                                (document.querySelector('.sort__text') as HTMLElement).innerHTML = item.getElementsByTagName('label')[0].innerHTML;
                                paramsObject.type = item.getElementsByTagName('input')[0].getAttribute('id') as string;
                                syncURL(paramsObject);
                            }
                        }
                    }
                }
            });
        });
    }

    updateNameSort(){
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
            if(paramsObject.type !== undefined){
                if(paramsObject.type === 'popularityUp'){
                    (document.querySelector('.sort__text') as HTMLElement).innerHTML = 'By popularity(Ascending)';
                }
                else if(paramsObject.type === 'popularityLow'){
                    (document.querySelector('.sort__text') as HTMLElement).innerHTML = 'By popularity(Descending)';
                }
                else if(paramsObject.type === 'priceUp'){
                    (document.querySelector('.sort__text') as HTMLElement).innerHTML = 'By price(Ascending)';
                }
                else if(paramsObject.type === 'priceLow'){
                    (document.querySelector('.sort__text') as HTMLElement).innerHTML = 'By price(Descending)';
                }
                syncURL(paramsObject);
            }
        }
        else {
            syncURL(allFilters);
        }
    }

     sort(sortType: string, arrayProducts: IProduct[]): IProduct[]{
        let productsList: IProduct[];
        productsList = arrayProducts;
        if(sortType === 'By popularity(Ascending)' || sortType === 'popularityUp'){
            productsList = productsList.sort((i, j) => {
                const firstIem = i.rating;
                const secondItem = j.rating;
                if (firstIem > secondItem) {
                    return -1;
                }
                if (firstIem < secondItem) {
                    return 1;
                }
                 return 0;
            });
            return productsList;
        }
        else if(sortType === 'By popularity(Descending)' || sortType === 'popularityLow') {
            productsList = productsList.sort((i, j) => {
                const firstIem = i.rating;
                const secondItem = j.rating;
                if (firstIem > secondItem) {
                    return 1;
                }
                if (firstIem < secondItem) {
                    return -1;
                }
                 return 0;
            });
            return productsList;
        }
        else if(sortType === 'By price(Ascending)' || sortType === 'priceUp'){
            productsList = productsList.sort((i, j) => {
                const firstIem = i.price;
                const secondItem = j.price;
                if (firstIem > secondItem) {
                    return -1;
                }
                if (firstIem < secondItem) {
                    return 1;
                }
                 return 0;
            });
            return productsList;
        }
        else if(sortType === 'By price(Descending)' || sortType === 'priceLow'){
            productsList = productsList.sort((i, j) => {
                const firstIem = i.price;
                const secondItem = j.price;
                if (firstIem > secondItem) {
                    return 1;
                }
                if (firstIem < secondItem) {
                    return -1;
                }
                 return 0;
            });
            return productsList;
        }
        return arrayProducts;
    }
}
