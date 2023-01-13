import { CartObject, IProduct } from '../../../types/types';

export class DrawMain {
  async draw(data: IProduct[]) {
    const products: IProduct[] = data;
    let typeView = 'blocks';
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
      if(paramsObject.view !== undefined){
        typeView = paramsObject.view;
        this.drawCards(products, typeView);
      }
    }
    else {
      this.drawCards(products, typeView);
    }
    
  }

  drawCards(products: IProduct[], typeView: string){
    const catalog = document.querySelector('.catalog__products') as HTMLElement;
    const productsSpace = document.querySelector('.catalog__products') as HTMLElement;
    const headerFound = document.getElementById('foundblock');
    if(headerFound){
      headerFound.innerHTML = `${products.length}`;
      localStorage.setItem('headerTotalTrod', headerFound.innerText)
    } 

    catalog.innerHTML = '';
    let textButton = 'Add to cart';
    let idInCart: string[] = []
    if(localStorage.getItem('arrayOfId') !== null){
      idInCart = localStorage.getItem('arrayOfId')?.split(',') as string[];
    }
    if(typeView === 'blocks'){
      productsSpace.style.display = 'grid';
      for (let i = 0; i < products.length; i++) {
        const product: IProduct = products[i];
        const div = document.createElement('div') as HTMLElement;
        div.classList.add('catalog__product');
        div.classList.add('product');
        if(idInCart.indexOf(product.id.toString()) >= 0){
          textButton = 'Remove from cart';
        }
        else {
          textButton = 'Add to cart';
        }
        const cart: string = `
              <div class="product__discount-wrap">
              <p class="product__discount">-${product.discountPercentage}%</p>
              </div>
              <div class="product__image">
              <img src="${product.thumbnail}" alt="picture"></img>
              </div>
              <div class="product__rating-wrap">
              <p class="product__rating">★${product.rating}</p>
              </div>
              <div class="product__title-wrap">
              <p class="product__title">${product.title}</p>
              </div>
              <div class="product__price-wrap">
              <p class="product__price price">${product.price}$ 
                  <span class="price__old">${Math.round(
                    product.price * (product.discountPercentage / 100) + product.price
                  )}$</span>
                  <span class="price__discount">${Math.round(
                    product.price - (product.price * (product.discountPercentage / 100) + product.price)
                  )}$</span>
              </p>
              </div>
              <div class="product__add-wrap">
                <button class="product__add" id="${product.id}">${textButton}</button>
              </div>`;
        div.innerHTML = cart;
        catalog.appendChild(div);
        (div.querySelector('.product__image') as HTMLElement).addEventListener('click', ()=>{
          location.hash = 'product-page';
          location.search = `/${product.id}/${product.title}`
        });
      }
      const btns = document.querySelectorAll('.product__add');
      btns.forEach((el) => {
        el.addEventListener('click', () => {
          if(el.innerHTML === 'Add to cart'){
            el.innerHTML = 'Remove from cart';
            this.makeArrayOfProducts(products, el);
          }
          else {
            el.innerHTML = 'Add to cart';
            this.removeFromCart(products, el);
          }
        });
      });
    }
    else {
      productsSpace.style.display = 'flex';
      productsSpace.style.flexDirection = 'column';
      for (let i = 0; i < products.length; i++) {
        const product: IProduct = products[i];
        const div = document.createElement('div') as HTMLElement;
        div.classList.add('catalog__product_line');
        div.classList.add('product_line');
        if(idInCart.indexOf(product.id.toString()) >= 0){
          textButton = 'Remove from cart';
        }
        else {
          textButton = 'Add to cart';
        }
        const cart: string = `
              <div class="product_line__img-wrap">
                <div class="product_line__image">
                  <img src="${product.thumbnail}" alt="picture"></img>
                </div>
              </div>
              <div class="product_line__inf-wrap">
                <div class="product_line__discount-wrap">
                  <p class="product_line__discount">-${product.discountPercentage}%</p>
                </div>
                <div class="product__title-wrap">
                  <p class="product__title">${product.title}</p>
                </div>
                <div class="product_line__rating-wrap">
                  <p class="product_line__rating">★${product.rating}</p>
                </div>
                <div class="product_line__description-wrap">
                  <p class="product_line__description">${product.description}</p>
                </div>
              </div>
              <div class="product_line__add-wrap">
                <div class="product_line__price-wrap">
                  <p class="product_line__price price">${product.price}$ 
                      <span class="price__old">${Math.round(
                        product.price * (product.discountPercentage / 100) + product.price
                      )}$</span>
                      <span class="price__discount">${Math.round(
                        product.price - (product.price * (product.discountPercentage / 100) + product.price)
                      )}$</span>
                  </p>
                </div>
                <div class="product_line__add-wrap">
                  <button class="product_line__add" id="${product.id}">${textButton}</button>
                </div>
              </div>`;
        div.innerHTML = cart;
        catalog.appendChild(div);
      }
      const btns = document.querySelectorAll('.product_line__add');
      btns.forEach((el) => {
        el.addEventListener('click', () => {
          if(el.innerHTML === 'Add to cart'){
            el.innerHTML = 'Remove from cart';
            this.makeArrayOfProducts(products, el);
          }
          else {
            el.innerHTML = 'Add to cart';
            this.removeFromCart(products, el);
          }
        });
      });
    }
    (document.querySelector('.to-basket__pict') as HTMLElement).addEventListener('click', () => {
      location.hash = 'cart-page';
    });
  }
  makeArrayOfProducts(arr: IProduct[], el: Element) {
    let filtredArray: IProduct[] = [];
    let arrayOfProdForCart: string[] = [];
    if(localStorage.getItem('arrayOfId') !== null){
      arrayOfProdForCart = localStorage.getItem('arrayOfId')?.split(',') as string[];
    }
    arrayOfProdForCart.push(el.id);
    localStorage.setItem('arrayOfId', arrayOfProdForCart.toString());
    filtredArray = arr.filter((el) => {
      let isitem: boolean = false;
      for (let i = 0; i < arrayOfProdForCart.length; i++) {
        const itemNum: string = arrayOfProdForCart[arrayOfProdForCart.length - 1];
        if (Number(el.id) === Number(itemNum)) {
          isitem = true;
        }
      }
      if (isitem) return true;
    });
    let sum: number = filtredArray.map((el) => el.price).reduce((partialSum, a) => partialSum + a, 0);
    sum = sum + Number((document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML);
    localStorage.setItem('total-header', `${sum}`);
    (document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML = `${sum}`;
    (document.getElementById('found') as HTMLElement).innerHTML = (Number((document.getElementById('found') as HTMLElement).innerHTML) + 1).toString();
  }

  removeFromCart(arr: IProduct[], el: Element) {
    let filtredArray: IProduct[] = [];
    let arrayOfProdForCart: string[] = [];
    if(localStorage.getItem('arrayOfId') !== null){
      arrayOfProdForCart = localStorage.getItem('arrayOfId')?.split(',') as string[];
    }
    filtredArray = arr.filter((elem) => {
      let isitem: boolean = false;
      for (let i = 0; i < arrayOfProdForCart.length; i++) {
        const itemNum: string = arrayOfProdForCart[arrayOfProdForCart.indexOf(el.id)];
        if (Number(elem.id) === Number(itemNum)) {
          isitem = true;
        }
      }
      if (isitem) return true;
    });
    let sum: number = filtredArray.map((el) => el.price).reduce((partialSum, a) => partialSum + a, 0);
    let arrayFromSorage: CartObject[] = [];
    const stringProdFromLS: string | null = localStorage.getItem('storeBuyList');
    if (stringProdFromLS) {
      arrayFromSorage = JSON.parse(stringProdFromLS);
      const index = arrayFromSorage.map(x => {
        return x.id;
      }).indexOf(el.id);
      sum = Number((document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML) - sum * arrayFromSorage[index].count;
      if(arrayFromSorage[index] !== undefined){
        arrayFromSorage.splice(arrayFromSorage.indexOf(arrayFromSorage[index]), 1);
      }
      localStorage.setItem('storeBuyList', JSON.stringify(arrayFromSorage));
    }
    else {
      sum = Number((document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML) - sum;
    }
    localStorage.setItem('total-header', `${sum}`);
    arrayOfProdForCart.splice(arrayOfProdForCart.indexOf(el.id), 1);
    localStorage.setItem('arrayOfId', arrayOfProdForCart.toString());
    (document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML = `${sum}`;
    (document.getElementById('found') as HTMLElement).innerHTML = (Number((document.getElementById('found') as HTMLElement).innerHTML) - 1).toString();
  }
}