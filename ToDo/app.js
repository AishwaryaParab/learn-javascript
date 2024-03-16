// selectors
const toDoInput = document.querySelector(".to-do-input");
const toDoBtn = document.querySelector(".to-do-btn");
const toDoList = document.querySelector(".to-do-list");
const filterList = document.querySelector(".filter-todo");

document.addEventListener('DOMContentLoaded', getTodos);

// add items
toDoBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // create DIV
    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('to-do');

    // create LI tag
    const toDoItem = document.createElement('li');
    toDoItem.classList.add('to-do-item');
    toDoItem.innerText = toDoInput.value;
    toDoDiv.appendChild(toDoItem);
    saveLocalToDos(toDoInput.value);

    // create complete btn
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = "<i class='fas fa-check'></i>";
    toDoDiv.appendChild(completeBtn);

    // create delete btn
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = "<i class='fas fa-trash'></i>";
    toDoDiv.appendChild(deleteBtn);

    // adding DIV to the UL list
    toDoList.appendChild(toDoDiv);
    toDoInput.value = "";
})

// delete or complete items
toDoList.addEventListener('click', (e) => {
    const item = e.target;

    // delete
    if(item.classList[0] === "delete-btn") {
        const toDo = item.parentElement;
        toDo.classList.add('fall');
        removeTodos(toDo);

        // will execute after the transition is complete
        toDo.addEventListener('transitionend', () => {
            toDo.remove();
        })
    }

    // completed
    if(item.classList[0] === "complete-btn") {
        const toDo = item.parentElement;
        toDo.classList.toggle('completed');
    }
})

// filter items
filterList.addEventListener('change', (e) => {
    const todos = toDoList.children; // converted to HTMLCollection

    for(let todo of todos) {  // cannot use forEach that's why
        switch(e.target.value) {
            case 'all':
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "progress":
                if(!todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    }
})

// save to localStorage
function saveLocalToDos(todo) {
    let todos;

    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// get todos from localStorage
function getTodos() {
    let todos;
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    } else {
        todos = [];
    }
    
    todos.forEach((todo) => {
    // create DIV
    const toDoDiv = document.createElement('div');
    toDoDiv.classList.add('to-do');

    // create LI tag
    const toDoItem = document.createElement('li');
    toDoItem.classList.add('to-do-item');
    toDoItem.innerText = todo; // getting from localStorage
    toDoDiv.appendChild(toDoItem);

    // create complete btn
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = "<i class='fas fa-check'></i>";
    toDoDiv.appendChild(completeBtn);

    // create delete btn
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = "<i class='fas fa-trash'></i>";
    toDoDiv.appendChild(deleteBtn);

    // adding DIV to the UL list
    toDoList.appendChild(toDoDiv);
    toDoInput.value = "";
    })
}

// remove todos from localStorage
function removeTodos(todo) {
    let todos;

    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoText = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoText), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}