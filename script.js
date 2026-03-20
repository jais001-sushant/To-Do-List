const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const emptyState = document.getElementById("empty-state");
const counterText = document.getElementById("counter-text");

let currentFilter = "all";

function addTask() {
    if (inputBox.value.trim() === '') {
        alert("You must write something!");
        return;
    }

    let li = document.createElement("li");
    li.textContent = inputBox.value.trim();
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "\u00D7";
    li.appendChild(span);

    inputBox.value = "";
    saveData();
    updateCounter();
    updateEmptyState();
    applyFilter(currentFilter);
}

inputBox.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
        addTask();
    }
});

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
        updateCounter();
        applyFilter(currentFilter);
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
        updateCounter();
        updateEmptyState();
        applyFilter(currentFilter);
    }
}, false);

function filterTasks(filter) {
    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    applyFilter(filter);
    updateEmptyState();
}

function applyFilter(filter) {
    const allTasks = listContainer.querySelectorAll("li");

    allTasks.forEach(task => {
        switch (filter) {
            case "all":
                task.style.display = "block";
                break;
            case "active":
                task.style.display = task.classList.contains("checked") ? "none" : "block";
                break;
            case "completed":
                task.style.display = task.classList.contains("checked") ? "block" : "none";
                break;
        }
    });
}

function updateCounter() {
    const allTasks = listContainer.querySelectorAll("li");
    const completedTasks = listContainer.querySelectorAll("li.checked");
    const remaining = allTasks.length - completedTasks.length;

    if (allTasks.length === 0) {
        counterText.textContent = "";
    } else {
        counterText.textContent = `${remaining} of ${allTasks.length} task${allTasks.length > 1 ? "s" : ""} remaining`;
    }
}

function updateEmptyState() {
    const allTasks = listContainer.querySelectorAll("li");
    const visibleTasks = [...allTasks].filter(t => t.style.display !== "none");

    if (allTasks.length === 0) {
        emptyState.querySelector("p").textContent = "No tasks yet! Add one above 🎉";
        emptyState.style.display = "block";
    } else if (visibleTasks.length === 0) {
        if (currentFilter === "active") {
            emptyState.querySelector("p").textContent = "No active tasks! All done ✅";
        } else if (currentFilter === "completed") {
            emptyState.querySelector("p").textContent = "No completed tasks yet 🔄";
        }
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
}

function showTask(){
    const data = localStorage.getItem("data");
    listContainer.innerHTML = data ? data : "";
    updateCounter();
    updateEmptyState();
    applyFilter(currentFilter);
}
showTask();