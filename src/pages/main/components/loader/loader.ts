export class Loader {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  async load() {
    const data = fetch(this.path)
      .then((inform) => {
        if (!inform.ok) {
          throw new Error();
        }
        return inform.json();
      })
      .catch((err) => console.log(err));
    const products = await data.then(result => result.products);
    return products;
  }
}