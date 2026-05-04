const myLibrary = [];
const logMenu = document.querySelector(".log__menu");

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

// Function that loop through myLibrary and display each book on the page
function renderLog() {
    logMenu.innerHTML = "";
    for (const book of myLibrary) {
        // Create the list of book
        const bookItem = document.createElement("li");
        bookItem.classList.add("book");
        bookItem.dataset.id = book.id;

        // Add html(info) of the book into it's innerHTML
        bookItem.innerHTML = `
                            <div class="book__cover"></div>
                            <div class="book__info">
                                <h3 class="book__title">${book.title}</h3>
                                <p class="book__author">${book.author}</p>
                                <p class="book__page">${book.pages} pages</p>
                            </div>
                            <p class="book__read read">Read</p>
                            <label class="switch">
                                <input class="switch__input" type="checkbox">
                                <span class="switch__slider"></span>
                            </label>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon trash__icon"
                            >
                                <title>Delete</title>
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>`;
        logMenu.appendChild(bookItem);
    }
}

renderLog();

// TODO: 4. Add a new book btn that open up a form (e.preventDefault() to stop submisiion to server)

// Remove and Edit book entries
logMenu.addEventListener("click", (e) => {
    const remove = e.target.closest(".trash__icon");
    const edit = e.target.closest(".edit__icon");
    if (!remove && !edit) return;

    const bookItem = e.target.closest(".book");
    const entryID = bookItem.dataset.id;

    if (remove) {
        removeEntries(entryID);
    } else if (edit) {
        openEditModal(entryID);
    }

    // Re-render the book log
    renderLog();
});

// Function to remove book entries
function removeEntries(id) {
    // Find the index of the book that have that id
    const index = myLibrary.indexOf(myLibrary.find((book) => book.id === id));

    // Only slice array when item(book) is found
    if (index > -1) {
        myLibrary.splice(index, 1);
    }
}

// Function to edit book entries

// TODO: 6. A tbn on each book to change it's read status (Book prototype funct that toggle a book instance's read status)
