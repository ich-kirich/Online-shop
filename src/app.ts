import { Main } from "./pages/main/main";
import './libs/normalize.css';
import './libs/index.scss';
import { ProductPage } from "./pages/productPage/productPage";
import { ErrorPage } from "./pages/404/error";
import { CartPage } from "./pages/cart/cartPage";

export enum PageIds {
  MainPage = 'main-page',
  ProductPage = 'product-page',
  ErrorPage = 'error-page',
  CartPage = 'cart-page'
}

class App {
  cartPage: CartPage;
  mainPage : Main;
  productPage: ProductPage;
  errorPage: ErrorPage;
  bodyPage: HTMLElement;

  constructor(){
    this.mainPage = new Main();
    this.productPage = new ProductPage();
    this.errorPage = new ErrorPage();
    this.bodyPage = document.body;
    this.cartPage = new CartPage();
  }

  run(){
    (this.bodyPage.querySelector('.main') as HTMLElement).innerHTML = '';
    this.renderNewPage(window.location.hash.slice(1));
    this.enableRouteChange();
  }

  renderNewPage(idPage: string){
    (document.body.querySelector('.main') as HTMLElement).innerHTML = '';
    if(idPage === PageIds.MainPage || idPage === ''){
      this.mainPage.init();
    }
    else if(idPage === PageIds.ProductPage){
      this.productPage.createPage(PageIds.ProductPage);
    }
    else if(idPage === PageIds.ErrorPage){
      this.errorPage.createPage(PageIds.ErrorPage);
    }
    else if(idPage === PageIds.CartPage){
      this.cartPage.createPage(PageIds.CartPage);
    }
  }

  enableRouteChange(){
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      this.renderNewPage(hash);
    });
  }
}

const app = new App();
app.run();