export class ErrorPage {
    errorBlock: HTMLElement;
    constructor(){
        this.errorBlock = document.body;
    }

    async createPage(id: string){
      this.errorBlock.id = id;
    }
}
