export class Product{
  private container: HTMLElement | null;

  constructor(id: string) {
    this.container = document.querySelector('.main__wrapper') as HTMLElement;
    this.container.id = id;
  }
  async draw(){
    if(this.container){
      this.container.innerHTML ='';
      
    }
  }
}