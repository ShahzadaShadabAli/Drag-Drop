const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let isLocalStorageLoaded = false

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let isDragging;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const itemsArray = ['backlogItems', 'progressItems', 'completeItems', 'onHoldItems']
  listArrays.forEach((list, i) =>{
    localStorage.setItem(`${itemsArray[i]}`, JSON.stringify(list))
  })
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}



// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = true
  listEl.id = index
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  //Append
  columnEl.appendChild(listEl)

}


// Filtering the array to remove the empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null)
  console.log(filteredArray)
  return filteredArray
}


// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!isLocalStorageLoaded) {
    getSavedColumns()
  }
    // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
  backlogListArray = filterArray(backlogListArray)
  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index)
  })
  progressListArray = filterArray(progressListArray)
  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  })
  completeListArray = filterArray(completeListArray)
  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  onHoldListArray = filterArray(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
 isLocalStorageLoaded = true
 updateSavedColumns()

}

//Update Items - Delete if Blanked or Update if Changed
function updateItem(id, column) {
  const selectedArray = listArrays[column]
  console.log(selectedArray)
  const selectedColumnElement = listColumns[column].children
  console.log(selectedColumnElement[id].textContent)
 if (!isDragging) {
  if (!selectedColumnElement[id].textContent) {
    delete selectedArray[id]
  } else {
    selectedArray[id] = selectedColumnElement[id].textContent
  }
  updateDOM()
 }
}

//To add the things on the list
function addToColumn(column) {
  console.log(addItems[column].textContent)
  const textItem = addItems[column].textContent
  const itemsArray = listArrays[column]
  itemsArray.push(textItem)
  addItems[column].textContent = ''
  updateDOM()
}

//To Show The Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

//To Hide The Add Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  if (addItems[column].textContent){
    addToColumn(column)

  }
  
}

function updateLists(){
  backlogListArray = []
  for (let i = 0; i < backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent)
  }
  progressListArray = []
  for (let i = 0; i < progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent)
  }
  completeListArray = []
  for (let i = 0; i < completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent)
  }
  onHoldListArray = []
  for (let i = 0; i < onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM()
}

//When The Item is Dragged
function drag(e) {
  draggedItem  = e.target
  console.log('draggedItem', draggedItem)
}

//To show That There's The Area Available To drop
function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column
}

//To make other elements to allow other items to be dropped on it
function allowDrop(e){
  e.preventDefault()
 isDragging = true
}

//To drop items on other places
function drop(e){
  e.preventDefault()
   //Loop Throught each list to remove the permanent color error
   listColumns.forEach((column) => {
    column.classList.remove('over')
  })
  //Add Item to column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  updateLists()
  isDragging = false
}

//On Load
updateDOM()