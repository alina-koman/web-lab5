export class Book {
    constructor(pages, author, price) {
        this.id = Date.now();
        this.pages = pages;
        this.author = author;
        this.price = price;
    }
}
