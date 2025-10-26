import { Book } from "./book.js";

const buttonOne = document.getElementById("btn-one")
const buttonTwo = document.getElementById("btn-two")
const container = document.getElementById("container")
const API_URL = "http://localhost:3500"

let books = [];

export const getInputValues = () => {
    const author = document.getElementById("author_input").value.trim();
    const pages = document.getElementById("pages_input").value.trim();
    const price = document.getElementById("price_input").value.trim();
    return [pages, author, price];
};

const validateInputs = (pages, author, price) => {
    let valid = true;
    if (author === "" || !isNaN(author)) {
        alert("Автор повинен містити лише літери (не цифри)!");
        document.getElementById("author_input").classList.add("error");
        valid = false;
    } else {
        document.getElementById("author_input").classList.remove("error");
    }

    if (pages === "" || isNaN(pages) || Number(pages) <= 0) {
        alert("Кількість сторінок повинна бути числом більше нуля!");
        document.getElementById("pages_input").classList.add("error");
        valid = false;
    } else {
        document.getElementById("pages_input").classList.remove("error");
    }

    if (price === "" || isNaN(price) || Number(price) <= 0) {
        alert("Ціна повинна бути числом більше нуля!");
        document.getElementById("price_input").classList.add("error");
        valid = false;
    } else {
        document.getElementById("price_input").classList.remove("error");
    }

    return valid;
};

const submitButton = (submitButton) => {
    submitButton.addEventListener('click', async () => {
        const [pages, author, price] = getInputValues();

        if (!validateInputs(pages, author, price)) return;

        const newBook = new Book (pages, author, price);
        try {
            const request = await fetch(API_URL, {
                method: "POST", 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            })
            const result = await request.json()
            books.push(newBook)
            console.log(result)
            alert("Книгу успішно збережено!");
        } catch (error) {
            console.log(error)
            alert("Не вдалось додати книгу.")
        }
    });
};

const renderBooks = (itemContainer, books) => {
    itemContainer.innerHTML = '';
    books.forEach(el => {
        itemContainer.innerHTML += `
        <div class="book-item">
            <p>ID: ${el.id}</p>
            <p>Author: ${el.author}</p>
            <p>Pages: ${el.pages}</p>
            <p>Price: ${el.price}</p>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        </div>
        `;
    });
    document.querySelectorAll('.edit-button').forEach((btn, idx) => {
        editButtonEvent(btn, idx);
    });
    document.querySelectorAll('.delete-button').forEach((btn, idx) => {
        deleteButtonEvent(btn, idx);
    });
};

const deleteButtonEvent = (deleteButton, index) => {
   deleteButton.addEventListener('click',async (e) => {
        container.innerHTML = `
            <ul id="items_container" class="col-md-6 mt-5 mt-md-2 mx-auto list-group">      
            </ul>
        `;

        try {
            await fetch(`${API_URL}/${index}`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await fetch(API_URL);
            const updatedBooks = await response.json()

            const itemContainer = document.getElementById('items_container');
            renderBooks(itemContainer, updatedBooks)
            alert("Книгу успішно видалено!");
        } catch (error) {
            console.log(error);
            alert("Не вдалось оновити.");
        }
   })
}

window.addEventListener('load', async () => {
    container.innerHTML = `
        <ul id="items_container" class="col-md-6 mt-5 mt-md-2 mx-auto list-group">      
        </ul>
    `;

    try {
        const response = await fetch(API_URL)
        const result = await response.json()

        const itemContainer = document.getElementById('items_container');
        renderBooks(itemContainer, result)
    } catch (error) {
        console.error(error)
    }

})

const editButtonEvent = (editButton, index) => {
    editButton.addEventListener('click', (e) => {
        buttonOne.classList.remove('active');
        buttonTwo.classList.add('active');

        const book = books[index];

        container.innerHTML = `
        <div class="row">
            <div class="col-md-4 mt-2">
                <form id="add_form" class="bg-light">
                    <h3 class="mb-3">Edit</h3>
                    <div class="mb-3">
                        <label class="form-label">Author</label>
                        <input type="text" value="${book.author}" class="form-control" id="author_input" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Pages</label>
                        <input type="number" value="${book.pages}" class="form-control" id="pages_input" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Price (UAH)</label>
                        <input type="number" value="${book.price}" class="form-control" id="price_input" />
                    </div>
                    <button id="submit_edit-button" type="button" class="btn btn-primary">
                        Edit
                    </button>
                </form>
            </div>
        </div>
        `;

        const submitEditButton = document.getElementById('submit_edit-button');
        submitEditButton.addEventListener('click', async () => {
            const [newPages, newAuthor, newPrice] = getInputValues();

            if (!validateInputs(newPages, newAuthor, newPrice)) return;

            const updatedBook = new Book( newPages, newAuthor, newPrice );

            try {
                const request = await fetch(`${API_URL}/${index}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedBook)
                });
                const result = await request.json();
                console.log(result);
                alert("Книгу успішно оновлено!");
            } catch (error) {
                console.log(error);
                alert("Не вдалось оновити.");
            }
        });
    });
};


buttonOne.addEventListener("click",async () => {
    container.innerHTML = `
        <ul id="items_container" class="col-md-6 mt-5 mt-md-2 mx-auto list-group">      
        </ul>
    `;
    const itemContainer = document.getElementById('items_container');
    try {
        buttonOne.classList.remove('active');
        buttonTwo.classList.remove('active');
        buttonOne.classList.add('active');

        const request = await fetch(API_URL)
        const result = await request.json()
        renderBooks(itemContainer, result);
        console.log(result)
    } catch (error) {
        console.log(error)
        alert("Не вдалось додати книгу.")
    } 
});

buttonTwo.addEventListener("click", () => {
    container.innerHTML = `
         <div class="row mb-3">
        <h1 class="text-center">My Books</h1>
    </div>
    <div class="row">
        <div class="col-md-4 mt-2">
            <form id="add_form" class="bg-light">
                <h3 class="mb-3">Create</h3>
                <div class="mb-3">
                    <label class="form-label">Author</label>
                    <input type="text" class="form-control" id="author_input" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Pages</label>
                    <input type="number" class="form-control" id="pages_input" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Price (UAH)</label>
                    <input type="number" class="form-control" id="price_input" />
                </div>
                <button id="submit_button" type="button" class="btn btn-primary">
                    Save
                </button>
            </form>
    `;
    const submitButtonElement = document.getElementById("submit_button");
    submitButton(submitButtonElement);
    buttonOne.classList.remove('active');
    buttonTwo.classList.remove('active');
    buttonTwo.classList.add('active');
});
