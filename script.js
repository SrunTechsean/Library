const myLibrary = [];

function Book(author, title, pages, read) {
    if (!new.target) {
        throw Error("You must use the new operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(author, title, pages, read) {
    const book = new Book(author, title, pages, read);

    myLibrary.push(book);
}

// Test to see if the libary is storing the book
for (let i = 0; i < 3; i++) {
    addBookToLibrary("Sean", "FireBook", 200, true);
}

// TODO: 3. Function that loop through myLibrary and display each book on the page
// TODO: 4. Add a new book btn that open up a form (e.preventDefault() to stop submisiion to server)

//TODO: 5. A btn on each book to remove it (data-atribute to associate the book id to the dom)

// TODO: 6. A tbn on each book to change it's read status (Book prototype funct that toggle a book instance's read status)
