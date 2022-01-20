//constructor for Book objects
function Book (title, author, pages, read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.read = read
};

Book.prototype.info = function (){
    return `"${this.title}"" by ${this.author}, has ${this.pages} pages, is ${this.read}`;
}

let myLibrary=[]; //array to store books objects
showInfo();

//function to add book object to library
function addBookToLibrary (title, author, pages, read) {
    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
    book.position = myLibrary.indexOf(book);
};
//function editing information about the book
function changeBookInLibrary (book, title, author, pages, read) {
    book.title = title;
    book.author = author;
    book.pages = pages;
    book.read = read;
};
//deleting book from library
function removeBookFromLibrary (index){
    myLibrary.splice(index,1);
};
//sortintg books in library by order (author, title) 
function sortBooks(order){
    myLibrary.sort((a,b)=> a[order] > b[order] ? 1 : -1);
}

//displays 1 book in library by adding a DOM-element
function displayOneBook (elem){
    let d = document.createElement('div');
    d.setAttribute('data-key', myLibrary.indexOf(elem));
    let p = document.createElement('p');
    p.textContent = elem.info();
    let rem = document.createElement('button'); //remove button
    rem.textContent = 'remove';
    rem.setAttribute('data-key',d.getAttribute('data-key'));
    rem.setAttribute('name','rem');
    rem.addEventListener('click',(e) =>{
        removeBookFromLibrary(parseInt(e.target.getAttribute('data-key')));
        displayBooks();
    });
    let edit = document.createElement('button');//edit button
    edit.textContent = 'edit';
    edit.setAttribute('data-key',d.getAttribute('data-key'));
    edit.setAttribute('name','edit');
    edit.addEventListener('click',(e)=>{
        showInfoPopup(parseInt(e.target.getAttribute('data-key')));
    });
    d.classList.add('singleBook');
    
    let list = document.querySelector('.list');
    list.appendChild(d);
    d.appendChild(p); 
    d.appendChild(rem);
    d.appendChild(edit);
};
//function displays book collection
function displayBooks(){
    let list = document.querySelector('.list');
    clearList(list);
    myLibrary.forEach(elem => {
        if (filterBook(elem,document.forms.display.filter.value)){ //if we had a filter
            displayOneBook(elem);
        }
    });
};
//filter read and unread books
function filterBook (elem, filterParam){
    if (filterParam === 'all'){
        return true;
    }
    else {
        return elem.read === filterParam;//true : false;
    }
};
//button adding new book
let addNewBook = document.querySelector('#add');
//adding new book into the library
addNewBook.addEventListener('click', showPopup);
function showPopup (){
    let popup = document.querySelector('.popup');
    popup.style.display='flex';
};
//shows popup with information about book
function showInfoPopup (index){
    let obj = myLibrary[index];
    let popup = document.querySelector('.popup');
    popup.style.display='flex';
    document.forms.bookinfo.title.value = obj.title;
    document.forms.bookinfo.author.value = obj.author;
    document.forms.bookinfo.pages.value = obj.pages;
    let radios = Array.from(document.forms.bookinfo.isread);
    radios.forEach(elem=>{
        if (elem.value === obj.isread){
            elem.setAttribute("checked");
        }
    })
    document.querySelector('.popup-content > div input').setAttribute('data-key',index);
};

let popupButtons = Array.from(document.querySelectorAll('.popup-content > div input'));
popupButtons.forEach(element => {
    element.addEventListener('click',(e)=>{
        let popup = document.querySelector('.popup');
        if (e.target.value === 'cancel'){
            popup.style.display = 'none';
            return;
        }
        if (bookinfoValidation()){
            popup.style.display = 'none';
            if(e.target.getAttribute('data-key')){
                let index = parseInt(e.target.getAttribute('data-key'));
                changeBookInLibrary(myLibrary[index], 
                                    document.forms.bookinfo.title.value,
                                    document.forms.bookinfo.author.value,
                                    document.forms.bookinfo.pages.value,
                                    document.querySelector('input[name="isread"]:checked').value);
                e.target.removeAttribute('data-key');
            }
            else {
            addBookToLibrary(document.forms.bookinfo.title.value,
                                document.forms.bookinfo.author.value,
                                document.forms.bookinfo.pages.value,
                                document.querySelector('input[name="isread"]:checked').value);
            }
            clearBookinfoForm();
            displayBooks();
       }
    })
});
//Adding functions to sort order radio buttons
let sortRadio = Array.from(document.forms.sort.order);
sortRadio.forEach(elem => {
    elem.addEventListener('click', e =>{
        sortBooks(e.target.value);
        displayBooks();
    })
});
//Adding function to filter radio buttons
let filterRadio = Array.from(document.forms.display.filter);
filterRadio.forEach (elem => {
    elem.addEventListener('click', displayBooks);
});

//clearing list of books
function clearList(node){
    node.textContent = '';
};
//simple validation book information
function formValidationText (node){
    if (node.value === ''){
        return false;
    }
    return true;
};
//validates number fields
function formValidationNumber (node){
    if (isNaN(parseInt(node.value)) || 
        node.value.indexOf(',')!== -1 ||
        node.value.indexOf('.')!== -1){
        return false;
    }
    return true;
};
//validates text fields
function bookinfoValidation () {
    let title = document.forms.bookinfo.title;
    let author = document.forms.bookinfo.author;
    let pages = document.forms.bookinfo.pages;
    if (!formValidationText(title)){
        alert(`Check title input!`);
        return false;
    }
    else if (!formValidationText(author)){
        alert(`Check author input!`);
        return false;
    }
    else if (!formValidationNumber(pages)){
        alert(`Check pages input!`);
        return false;
    }
    else {
        return true;
    }
};
//clearing popup form
function clearBookinfoForm (){
    document.forms.bookinfo.title.value = document.forms.bookinfo.author.value = document.forms.bookinfo.pages.value = '';
};
//shows total info
function showInfo () {
    let read = myLibrary.reduce(function (sum,elem){
        return elem.read === 'read' ? ++sum : sum;        
    },0);
    let unread = myLibrary.reduce(function (sum,elem){
        return elem.read === 'unread' ? ++sum : sum; 
    },0);

    document.querySelectorAll('.info p')[0].textContent = `Books in library: ${myLibrary.length}`;
    document.querySelectorAll('.info p')[1].textContent = `Read books: ${read}`;
    document.querySelectorAll('.info p')[2].textContent = `Unread books: ${unread}`;
}




