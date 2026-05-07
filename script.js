const myLibrary = [];
const logMenu = document.querySelector(".log__menu");
const addButton = document.querySelector(".btn__add");
// A key to know if a book is being edited
let editingID = null;

// Grab modal element so that I can get the value of the submitted answer
const modal = {
    dialog: document.querySelector(".modal"),
    form: document.querySelector(".form"),
    author: document.querySelector("#author"),
    title: document.querySelector("#title"),
    pages: document.querySelector("#pages"),
    read: document.querySelector(".switch__input"),
};

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
addBookToLibrary("Sean", "FireBook", 200, false);

// Function that loop through myLibrary and display each book on the page
function renderLog() {
    logMenu.innerHTML = "";
    for (const book of myLibrary) {
        // Create the list of book
        const bookItem = document.createElement("li");
        bookItem.classList.add("book");
        bookItem.dataset.id = book.id;

        const checkedAttr = book.read ? "checked" : "";
        const readClass = book.read ? "read" : "unread";
        const readText = book.read ? "Read" : "Unread";

        // Add html(info) of the book into it's innerHTML
        bookItem.innerHTML = `
                            <div class="book__cover"></div>
                            <div class="book__info">
                                <h3 class="book__title">${book.title}</h3>
                                <p class="book__author">${book.author}</p>
                                <p class="book__page">${book.pages} pages</p>
                            </div>
                            <p class="book__read ${readClass} ">${readText}</p>
                            <label class="switch">
                                <input ${checkedAttr} class="switch__input" type="checkbox">
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

// e.preventDefault() to stop submisiion to server
addButton.addEventListener("click", (e) => {
    e.preventDefault();

    modal.dialog.showModal();
});

// Listen to the whole modal and target close btn inside it
// Since the modal have 2 close btn
modal.dialog.addEventListener("click", (e) => {
    if (e.target.closest(".close")) {
        modal.dialog.close();
    }
});

// Get form input to update book in library
modal.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = capitalize(modal.title.value);
    const author = modal.title.value;
    const pages = Number(modal.pages.value);
    const read = modal.read.checked;

    // state.editingID means that a meal is currently being edited and is not a new meal log
    if (editingID) {
        editBook(author, title, pages, read);
    } else {
        addBookToLibrary(author, title, pages, read);
    }

    editingID = null;
    modal.form.reset();
    modal.dialog.close();

    renderLog();
});

// Remove and Edit book entries
logMenu.addEventListener("click", (e) => {
    const remove = e.target.closest(".trash__icon");
    const edit = e.target.closest(".edit__icon");
    const checkbox = e.target.closest(".switch__input");

    if (!remove && !edit && !checkbox) return;

    const bookItem = e.target.closest(".book");
    const entryID = bookItem.dataset.id;

    // I put renderlog inside each cuz checkbox don't need to reRender
    if (remove) {
        removeEntries(entryID);
        // Re-render the book log
        renderLog();
    } else if (edit) {
        openEditModal(entryID);
        // Re-render the book log
        renderLog();
    } else if (checkbox) {
        const badge = bookItem.querySelector(".book__read");
        editReadStatus(entryID, badge);
    }
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

// TODO: Function to edit book entries
function editBook() {
    return;
}

// Toggle the book read status and it's badge
function editReadStatus(id, badge) {
    const book = myLibrary.find((book) => book.id === id);
    book.read = !book.read;

    // It dynamically add className (read, unread) depending on the toggle
    badge.classList.toggle("read", book.read);
    badge.classList.toggle("unread", !book.read);

    // Change the badge text so that it match the toggle
    if (!book.read) {
        badge.textContent = "Unread";
    } else {
        badge.textContent = "Read";
    }
}

// Helper function to help capitalize the first character for author, title
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
