class Book {
    constructor(title, author, pages, read) {
        this.title = title,
        this.author = author,
        this.pages = pages,
        this.read = read;
    }
    info() {
        return `"${this.title}"" by ${this.author}, has ${this.pages} pages, is ${this.read}`;
    }
};

class Library {
    constructor (){
        this.myLibrary =[];//array to store books objects
    }
    addBookToLibrary (title, author, pages, read) {//function to add book object to library
        let book = new Book(title, author, pages, read);
        this.myLibrary.push(book);
        book.position = this.myLibrary.indexOf(book);
    }
    changeBookInLibrary (book, title, author, pages, read) {
        book.title = title;
        book.author = author;
        book.pages = pages;
        book.read = read;
    }
    removeBookFromLibrary (index){
        this.myLibrary.splice(index,1);
    }
    sortBooks(order){
        this.myLibrary.sort((a,b)=> a[order] > b[order] ? 1 : -1);
    }
}

class Display {
    constructor () {
        this.lib = new Library();
        //button adding new book
        this.addNewBook = document.querySelector('#add');
        //Buttons in popup form
        this.popupButtons = Array.from(document.querySelectorAll('.popup-content > div input'));
        //Adding functions to sort order radio buttons
        this.sortRadio = Array.from(document.forms.sort.order);
        //Adding function to filter radio buttons
        this.filterRadio = Array.from(document.forms.display.filter);  
    }
    //displays 1 book in library by adding a DOM-element
    displayOneBook (elem){
        let d = document.createElement('div');
        d.setAttribute('data-key', this.lib.myLibrary.indexOf(elem));
        let p = document.createElement('p');
        p.textContent = elem.info();
        let rem = document.createElement('button'); //remove button
        rem.textContent = 'remove';
        rem.setAttribute('data-key',d.getAttribute('data-key'));
        rem.setAttribute('name','rem');
        rem.addEventListener('click',(e) =>{
            this.lib.removeBookFromLibrary(parseInt(e.target.getAttribute('data-key')));
            this.displayBooks();
        });
        let edit = document.createElement('button');//edit button
        edit.textContent = 'edit';
        edit.setAttribute('data-key',d.getAttribute('data-key'));
        edit.setAttribute('name','edit');
        edit.addEventListener('click',(e)=>{
            this.showInfoPopup(parseInt(e.target.getAttribute('data-key')));
        });
        d.classList.add('singleBook');
        let list = document.querySelector('.list');
        list.appendChild(d);
        d.appendChild(p); 
        d.appendChild(rem);
        d.appendChild(edit);
    };
     //clearing list of books
     clearList(node){
        node.textContent = '';
    }
     //shows common information about library
     showInfo () {
        let read = this.lib.myLibrary.reduce(function (sum,elem){
            return elem.read === 'read' ? ++sum : sum;        
        },0);
        let unread = this.lib.myLibrary.reduce(function (sum,elem){
            return elem.read === 'unread' ? ++sum : sum; 
        },0);
        document.querySelectorAll('.info p')[0].textContent = `Books in library: ${this.lib.myLibrary.length}`;
        document.querySelectorAll('.info p')[1].textContent = `Read books: ${read}`;
        document.querySelectorAll('.info p')[2].textContent = `Unread books: ${unread}`;
    }
    showPopup (){
        document.querySelector('.popup').style.display='flex';
    }
    //function displays book collection
    displayBooks(){
        document.querySelector('.list').textContent = '';
        this.showInfo();
        this.lib.myLibrary.forEach(elem => {
            if (this.filterBook(elem,document.forms.display.filter.value)){ //if we had a filter
                this.displayOneBook(elem);
            }
        });
    };
    //filter read and unread books
    filterBook (elem, filterParam){
        if (filterParam === 'all'){
            return true;
        }
        else {
            return elem.read === filterParam;//true : false;
        }
    };
    //shows popup with information about book
    showInfoPopup (index){
        let obj = this.lib.myLibrary[index];
        document.querySelector('.popup').style.display='flex';
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
    //validates text fields
    bookinfoValidation () {
        let title = document.forms.bookinfo.title;
        let author = document.forms.bookinfo.author;
        let pages = document.forms.bookinfo.pages;
        if (!this.formValidationText(title)){
            this.showAlert(this.alertMessage(document.forms.bookinfo.title,'Check title input!'));
            return false;
        }
        else if (!this.formValidationText(author)){
            this.showAlert(this.alertMessage(document.forms.bookinfo.author,'Check author input!'));
            return false;
        }
        else if (!this.formValidationNumber(pages)){
            this.showAlert(this.alertMessage(document.forms.bookinfo.pages,'Check pages input!'));
            return false;
        }
        else {
            return true;
        }
    };
    //simple validation book information
    formValidationText (node){
        if (node.value === ''){
            return false;
        }
        return true;
    };
    //validates number fields
    formValidationNumber (node){
        if (isNaN(parseInt(node.value)) || 
            node.value.indexOf(',')!== -1 ||
            node.value.indexOf('.')!== -1){
            return false;
        }
        return true;
    };
    //function returns error message if validation is not proved
    alertMessage (elem, message) {
        let alert = document.createElement('div');
        alert.classList.add('alert');
        alert.textContent = message;
        let coords = elem.getBoundingClientRect();
        alert.style.left = (coords.left+100) + 'px';
        alert.style.top = (coords.top-40) + 'px';
        return alert;
    };
    //function shows alert message if validation falls
    showAlert (alert) {
        document.querySelector('body').appendChild(alert);
        setTimeout(()=>alert.remove(),500);
    };
    //clearing popup form
    clearBookinfoForm (){
        document.forms.bookinfo.title.value = document.forms.bookinfo.author.value = document.forms.bookinfo.pages.value = '';
    };
    //Adding EventListeres
    //adding new book into the library
    buttonsActivating(){
        this.addNewBook.addEventListener('click', this.showPopup);
        this.popupButtons.forEach(element => {
            element.addEventListener('click',(e)=>{
                let popup = document.querySelector('.popup');
                if (e.target.value === 'cancel'){
                    popup.style.display = 'none';
                    return;
                }
                if (this.bookinfoValidation()){
                    popup.style.display = 'none';
                    if(e.target.getAttribute('data-key')){
                        let index = parseInt(e.target.getAttribute('data-key'));
                        this.lib.changeBookInLibrary(this.lib.myLibrary[index], 
                                            document.forms.bookinfo.title.value,
                                            document.forms.bookinfo.author.value,
                                            document.forms.bookinfo.pages.value,
                                            document.querySelector('input[name="isread"]:checked').value);
                        e.target.removeAttribute('data-key');
                    }
                    else {
                        this.lib.addBookToLibrary(document.forms.bookinfo.title.value,
                                        document.forms.bookinfo.author.value,
                                        document.forms.bookinfo.pages.value,
                                        document.querySelector('input[name="isread"]:checked').value);
                    }
                    this.clearBookinfoForm();
                    this.displayBooks();
                }
            })
        });
        this.sortRadio.forEach(elem => {
            elem.addEventListener('click', e =>{
                this.lib.sortBooks(e.target.value);
                this.displayBooks();
            })
        });
        this.filterRadio.forEach (elem => {
            elem.addEventListener('click', () => {this.displayBooks()});
        });
    }
}

let display = new Display();
display.showInfo();
display.buttonsActivating();