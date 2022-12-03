// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery'); //input
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container'); // hiden/ visible
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option

let editElement;  // edit yaparken değiştireceğimiz value bilgisi olucak
let editFlag = false;
let editID = '';  // edit yaparken id  yi buna eşitleyeceğiz

// ****** EVENT LISTENERS **********

// submitform
form.addEventListener('submit', addItem);
// clear btn

clearBtn.addEventListener('click', clearItems);

window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  // -- ADD --  //
  if (value && !editFlag) {   
    createListItem(id, value);

    // display alert
    displayAlert('item add to the list', 'success');

    container.classList.add('show-container');

    addToLocalStorage(id, value);

    setBackToDefault(value);
    // console.log(element);

    // -- EDIT -- //
  } else if (value && editFlag) {
    editElement.innerHTML = value; // 2. inputa girdigimiz degeride şimdi edit elementi eklemiş olduk (değiştirdik)
    displayAlert('value changed', 'success');
    // set back to default
    editLocalStorage(editID, value);
    console.log(editID, value);
    setBackToDefault();
  } else {
    displayAlert('please enter value', 'danger');
  }
}

// display Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clearItems
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
    container.classList.remove('show-container');
    displayAlert('empty list', 'danger');
    setBackToDefault();
    localStorage.removeItem('list');
  }
}
// delete ıtem
function deleteItem(e) {
  // e.currentTarget.parentElement.parentElement.remove()// 1.method silmek için

  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  console.log(id);
  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert('item removed', 'success');
  setBackToDefault();
  //  remove from local storage
  removeFromToLocalStorage(id);

  //  const items = document.querySelectorAll('.grocery-item');
  // if(items.length === 0){
  //   container.classList.remove("show-container")
  // }
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;

  editElement = e.currentTarget.parentElement.previousElementSibling; // title içindeki "value" ulaşacağız

  grocery.value = editElement.innerHTML; // 1. degistirecegim elementi inputa getirdik

  editFlag = true;
  editID = element.dataset.id;

  submitBtn.textContent = 'Edit';
}

// set Back To Default
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  console.log('added to local storage');

  const grocery = { id: id, value: value };

  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));

  console.log(items);
}

function removeFromToLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;  // silinmeyen item leri return yapıyoruz
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    // find method da olur
    if (item.id === id) {
      item.value = value;
    }
    return item;  // değiştirdiğimiz ve diğer item leri return yapıyoruz
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}



// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  element.classList.add('grocery-item');
//--- attribute --- //
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
//--- attribute ---//
  element.innerHTML = ` <p class="title">${value}</p>
                         <div class="btn-container">
                           <button type="button" class="edit-btn">
                              <i class="fas fa-edit"></i>
                         </button>
             
                         <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                         </button>
             
            </div>`;

  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');

  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);

  list.appendChild(element);
}

/* UZUN kosul ifadesi
if(value !== "" && editFlag === false){
console.log("add item to list");
 }
else if(value !== "" && editFlag === true){
console.log("editing");
}
else{
console.log("empty value");
} */
