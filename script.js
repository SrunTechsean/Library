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

function Book(author, title, pages, read, cover) {
    if (!new.target) {
        throw Error("You must use the new operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.cover = cover;
}

function addBookToLibrary(author, title, pages, read, cover) {
    const book = new Book(author, title, pages, read, cover);

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
        const cover = book.cover
            ? ` <img
                    src="${book.cover}"
                    alt="${book.title}"
                    class="cover"
                                >`
            : "";

        const hideIconClass = book.cover ? "hidden" : "";

        // Add html(info) of the book into it's innerHTML
        bookItem.innerHTML = `
                            <div class="book__cover">
                                ${cover}
                                <label class="edit-cover ${hideIconClass}" type="button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="36"
                                        height="36"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon edit-cover__icon"
                                    >
                                        <title>Edit Book Cover</title>
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 12h8" />
                                        <path d="M12 8v8" />
                                    </svg>
                                    <input class="cover__input" type="file" accept="image/*">
                                </label>
                            </div>
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
                                    class="icon edit__icon"
                            >
                                    <title>Edit</title>
                                    <path
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                                    />
                                    <path d="m15 5 4 4" />
                            </svg>
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
    const author = modal.author.value;
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

// Remove, Edit, Toggle, addBookCover to book entries
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

// Listen for when file is selected
logMenu.addEventListener("change", (e) => {
    if (!e.target.classList.contains("cover__input")) return;

    const file = e.target.files[0];
    if (!file) return;

    const editIcon = e.target.closest(".edit-cover");
    if (!editIcon) return;

    const bookItem = e.target.closest(".book");
    const entryID = bookItem.dataset.id;
    const book = findBook(entryID);
    if (!book) return;

    const reader = new FileReader();
    // Only after finished reading do we render the cover
    reader.onload = (event) => {
        book.cover = event.target.result; // Base64 data URL
        editIcon.classList.add("hidden");
        renderLog();
    };

    // Read n return as Base64 data URl
    reader.readAsDataURL(file);
});

// Function to remove book entries
function removeEntries(id) {
    // Find the index of the book that have that id
    const index = myLibrary.indexOf(findBook(id));

    // Only slice array when item(book) is found
    if (index > -1) {
        myLibrary.splice(index, 1);
    }
}

// Function to open the modal with existing data
function openEditModal(entryID) {
    // Find > filter here cuz find return the single first element which in this case is the first obj, so I can use entry.mealType
    // If I use filter it will return a new array with the first obj then to access it i need to use sth like entry[0].mealType
    const book = findBook(entryID);

    // Track current editing ID
    editingID = entryID;

    modal.author.value = book.author;
    modal.title.value = book.title;
    modal.pages.value = book.pages;
    modal.read.checked = book.read;

    modal.dialog.showModal();
}

// Toggle the book read status and it's badge
function editReadStatus(id, badge) {
    const book = findBook(id);
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

// Function to edit book entries
function editBook(author, title, pages, read) {
    console.log({ author }, { title });
    const book = findBook(editingID);
    if (!book) return;

    book.author = author;
    book.title = title;
    book.pages = pages;
    book.read = read;

    renderLog();
}

// Helper function to help capitalize the first character for author, title
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Since I keep finding book with their id alot
// I creaet a funct for it
function findBook(id) {
    return myLibrary.find((book) => book.id === id);
}
