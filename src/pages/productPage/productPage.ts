import { Loader } from "../main/components/loader/loader";
import { CartObject, IProduct } from "../types/types";

export class ProductPage {
    productBlock: HTMLElement;
    loader: Loader;
    constructor(){
        this.loader = new Loader('assets/data/data.json');
        this.productBlock = document.body;
    }

    async createPage(id: string){
      const total = document.querySelector('.price-basket__name_count') as HTMLElement;
      if(localStorage.getItem('total-header') !== null){
        total.innerHTML = localStorage.getItem('total-header') as string;
      }
      else {
        total.innerHTML = '0';
      }
      (document.querySelector('.header__found') as HTMLElement).innerHTML = '';
      const infOfProduct = location.search.split('/');
      const data: IProduct[] = await this.loader.load();
      const product = data.find(o => o.id.toString() === infOfProduct[1]);
      this.productBlock.id = id;
      let idInCart: string[] = [];
      let textButton = 'ADD TO CART';
      if(localStorage.getItem('arrayOfId') !== null){
        idInCart = localStorage.getItem('arrayOfId')?.split(',') as string[];
      }
      if(idInCart.indexOf((product as IProduct).id.toString()) >= 0){
        textButton = 'REMOVE FROM CART';
      }
      else {
        textButton = 'ADD TO CART';
      }
      (this.productBlock.querySelector('.main') as HTMLElement).innerHTML = `
        <div class="container">
          <div class="main__wrapper" style="align-items: center; flex-direction: column;">
            <div class="main__path path">
                <p class="path__text">STORE >> ${product?.category.toUpperCase()} >> ${product?.brand.toUpperCase()} >> ${product?.title.toUpperCase()}</p>
            </div>
            <div class="main__product product">
              <div class="product__title">${product?.title}</div>
              <div class="product__inf">
                <div class="product__pictures pictures"></div>
                <div class="product__bidpict">
                  <img src="${product?.images[0]}" alt="picture"></img>
                </div>
                <div class="product__about about">
                  <div class="about__description">
                    <p class="about__title">Description:</p>
                    <p class="about__text">${product?.description}</p>
                  </div>
                  <div class="about__discount">
                    <p class="about__title">Discount:</p>
                    <p class="about__text">${product?.discountPercentage}%</p>
                  </div>
                  <div class="about__rating">
                    <p class="about__title">Rating:</p>
                    <p class="about__text">★${product?.rating}</p>
                  </div>
                  <div class="about__stock">
                    <p class="about__title">Stock:</p>
                    <p class="about__text">${product?.stock}</p>
                  </div>
                  <div class="about__brand">
                    <p class="about__title">Brand:</p>
                    <p class="about__text">${product?.brand}</p>
                  </div>
                  <div class="about__category">
                    <p class="about__title">Category:</p>
                    <p class="about__text">${product?.category}</p>
                  </div>
                </div>
                <div class="product__panel panel">
                  <div class="panel__price">${product?.price}$</div>
                  <button class="panel__add" id="${product?.id}">${textButton}</button>
                  <button class="panel__buy">BUY NOW</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      this.addPictures(product?.images as string[]);
      this.addEventListenersToPAge();
    }

    addPictures(pictures: Array<string>){
      const blockPict = this.productBlock.querySelector('.pictures');
      pictures.forEach(function(item) {
        const imgTag = createDivPict();
        imgTag.src = item;
        blockPict?.append(imgTag);
      });
    }

    addEventListenersToPAge(){
      const blockPict = (this.productBlock.querySelector('.pictures') as HTMLElement).getElementsByTagName('img');
      const blockPictArr = Array.prototype.slice.call(blockPict)
      const bigImg = (this.productBlock.querySelector('.product__bidpict') as HTMLElement).getElementsByTagName('img')
      blockPictArr.forEach(function(item) {
        item.addEventListener('click', ()=> {
          bigImg[0].src = item.src;
        });
      });
      const toCart = document.querySelector('.to-basket__pict');
      toCart?.addEventListener('click', ()=>{
        location.hash = 'cart-page';
        location.search = '';
      });
      const addToCart = document.querySelector('.panel__add');
      addToCart?.addEventListener('click', async ()=>{
        const data: IProduct[] = await this.loader.load();
        if(addToCart.innerHTML === 'ADD TO CART'){
          addToCart.innerHTML = 'REMOVE FROM CART';
          this.addToCart(data, addToCart);
        }
        else {
          addToCart.innerHTML = 'ADD TO CART';
          this.removeFromCart(data, addToCart);
        }
      });
    }

    addToCart(arr: IProduct[], el: Element) {
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
      }
      const index = arrayFromSorage.map(x => {
        return x.id;
      }).indexOf(el.id);
      sum = Number((document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML) - sum * arrayFromSorage[index].count;
      localStorage.setItem('total-header', `${sum}`);
      arrayOfProdForCart.splice(arrayOfProdForCart.indexOf(el.id), 1);
      if(arrayFromSorage[index] !== undefined){
        arrayFromSorage.splice(arrayFromSorage.indexOf(arrayFromSorage[index]), 1);
      }
      localStorage.setItem('arrayOfId', arrayOfProdForCart.toString());
      (document.querySelector('.price-basket__name_count') as HTMLElement).innerHTML = `${sum}`;
      localStorage.setItem('storeBuyList', JSON.stringify(arrayFromSorage));
    }
}

function createDivPict(){
  const block = document.createElement("img");
  block.alt = 'picture';
  return block
}