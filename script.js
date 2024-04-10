const input = document.getElementById("input")
const inputText = document.getElementById("input-text")
const list = document.getElementById("list")
const buttonFilter = document.getElementById("button-filter")
const search = document.getElementById("form-search__input")
const taskStatus = document.getElementById("status")

const localStorageItens = localStorage.getItem("task")

let itemList = localStorageItens ? JSON.parse(localStorageItens) : []

itemList.forEach(item => {
    createItemList(item)
})

input.addEventListener("submit", function(e) {
    e.preventDefault()
    
    const task = {
        "name": inputText.value,
        "state": false
    }
        
    task.id = itemList[itemList.length - 1] ? itemList[itemList.length - 1].id + 1 : 0
    
    createItemList(task)    
    clearInput()
    itemList.push(task)
    localStorageUpdate(itemList) 
    displayTaskStatus()
})

// Filtragem de elementos
filters.onchange = function() {
    list.innerHTML = ""
    search.value = ""    

    if(this.value === "all") {
        itemList.forEach(item => createItemList(item))
    }    

    if(this.value === "todo") {
       itemList.forEach(item => {
            if(item.state === false) createItemList(item)
       })
    }
   
    if(this.value === "done") {
        itemList.forEach(item => {
            if(item.state === true) createItemList(item)
        })
    }
}

// Barra de pesquisa de tarefas
search.addEventListener("input", () => {
    const li = document.querySelectorAll(".list-task__item");
    
    for(const item in li) {
        if(true === isNaN(item)) return

        const listItem = li[item];
        const itemText = listItem.children[1].innerHTML;
        const textToUpeprcase = itemText.toUpperCase()
        
        if(true === textToUpeprcase.includes(search.value.toUpperCase())) {
            listItem.style.display = "";

        } else {
            listItem.style.display = "none";

        }
    }   
})

const clearInput = () => {
    inputText.value = ""
    inputText.focus()
}

const localStorageUpdate = (task) => {
    localStorage.setItem("task", JSON.stringify(task))
    displayTaskStatus()
};

function createItemList(item) {    
    const li = document.createElement("li")
    li.classList.add("list-task__item")
    
    const nameItem = document.createElement("h4")
    nameItem.classList.add("name-item")
    
    const checkBox = createCheckbox(item)
        
    list.appendChild(li)
    li.appendChild(checkBox)
    li.appendChild(nameItem)
    li.appendChild(createButton("fa-pen", item))
    li.appendChild(createButton("fa-trash-can fa-sm", item))
    li.appendChild(createButton("fa-floppy-disk"))
    
    if(item.state === true) {
        nameItem.classList.add('completed')
        checkBox.checked = true
    };

    nameItem.innerHTML = formatUppercaseCharacter(item.name)
};

function formatUppercaseCharacter(item) {
    let firstChar = item.charAt(0).toUpperCase()
    let restChar = item.slice(1)
    return `${firstChar + restChar}.`
}

function createCheckbox(item) {
    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    
    checkbox.addEventListener("click", function() {
        taskChecked(this, item)
    });
    
    return checkbox
};

function taskChecked(checkbox, item) {
    const textItem = checkbox.nextElementSibling;

    if(item.state === false) {
        item.state = true;
        textItem.classList.add("completed");
        localStorageUpdate(itemList);   
    } else {
        item.state = false;
        textItem.classList.remove("completed");
        localStorageUpdate(itemList);
    };
};

function createButton(icon, item) {
    const button = document.createElement("button");
    button.innerHTML = `<i class="fa-solid ${icon} icon-small"></i>`
    
    button.addEventListener("click", function() {
        const currentButton = this.children[0];        
        
        if(currentButton.classList.contains("fa-pen")) editTask(this.parentElement, item);
        if(currentButton.classList.contains("fa-trash-can")) deleteTask(this.parentElement, item);
    })

    return button;
}

function editTask(li, item) {    
    const liItem = li.children
    console.log(li.children)
        
    liItem[2].classList.add("hide")
    liItem[3].classList.add("hide")
    liItem[1].classList.add("edit-mode")
    liItem[1].setAttribute("contenteditable", true)
    liItem[1].focus()
    liItem[4].style.display = "block"    
    
    document.addEventListener("click", (e) => {
        if(e.target.classList.contains("fa-floppy-disk")) {
            item.name = liItem[1].innerHTML
            localStorageUpdate(itemList)
                        
            liItem[4].style.display = "none"
            liItem[2].classList.remove("hide")
            liItem[3].classList.remove("hide")
            liItem[1].classList.remove("edit-mode")
            liItem[1].removeAttribute("contenteditable")
        }    
    })

    document.addEventListener("keypress", (e) => {
        if(e.code === "Enter") {
            item.name = liItem[1].innerHTML
            localStorageUpdate(itemList)
            
            liItem[4].style.display = "none"
            liItem[2].classList.remove("hide")
            liItem[3].classList.remove("hide")
            liItem[1].classList.remove("edit-mode")
            liItem[1].removeAttribute("contenteditable")            
        }
    })
       
}

function deleteTask(li, item) { 
    li.remove()
    itemList.splice(itemList.findIndex(element => element.id === item.id), 1)  
    localStorageUpdate(itemList)  
    displayTaskStatus() 
}

// Estado das tarefas
function displayTaskStatus() {
    let total = 0
    let itemToDo = 0
    let itemDo = 0
    let percent = 0

    itemList.forEach(item => {
        total += 1        
        if(item.state === false) itemToDo += 1
    });

    itemDo = total - itemToDo;
    if(total !== 0) percent = (itemDo / total) * 100
    taskStatus.innerHTML = 
        `<span>Total: ${total}</span> 
         <span>Concluídas: ${itemDo} - ${percent.toFixed()}%</span> 
         <span>Pendentes: ${itemToDo}</span>`
};

displayTaskStatus();
