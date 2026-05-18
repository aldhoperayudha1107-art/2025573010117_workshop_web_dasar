const todoInput = document.getElementById("todo-input");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const errorMessage = document.getElementById("error-message");
const taskCounter = document.getElementById("task-counter");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";

// SIMPAN LOCAL STORAGE
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// UPDATE COUNTER
function updateCounter() {
  const activeTasks = todos.filter((todo) => !todo.completed);

  taskCounter.textContent = `${activeTasks.length} tugas tersisa`;
}

// RENDER TODOS
function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");

    li.className = `todo-item
            priority-${todo.priority.toLowerCase()}
            ${todo.completed ? "completed" : ""}`;

    li.setAttribute("draggable", true);

    li.dataset.index = index;

    li.innerHTML = `
            <div class="todo-left">

                <input
                    type="checkbox"
                    ${todo.completed ? "checked" : ""}
                >

                <span class="todo-text">
                    ${todo.text}
                </span>

                <span class="priority-label">
                    ${todo.priority}
                </span>

            </div>

            <button class="delete-btn">
                Hapus
            </button>
        `;

    // CHECKBOX
    const checkbox = li.querySelector("input");

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;

      saveTodos();
      renderTodos();
    });

    // HAPUS
    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      todos = todos.filter((item) => item.id !== todo.id);

      saveTodos();
      renderTodos();
    });

    // EDIT
    const todoText = li.querySelector(".todo-text");

    todoText.addEventListener("dblclick", () => {
      const input = document.createElement("input");

      input.type = "text";
      input.value = todo.text;

      input.className = "edit-input";

      todoText.replaceWith(input);

      input.focus();

      function saveEdit() {
        const value = input.value.trim();

        if (value.length >= 3 && value.length <= 100) {
          todo.text = value;

          saveTodos();
          renderTodos();
        } else {
          alert("Tugas harus 3-100 karakter");
        }
      }

      input.addEventListener("blur", saveEdit);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveEdit();
        }
      });
    });

    // DRAG START
    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    // DRAG END
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");

      saveTodos();
    });

    todoList.appendChild(li);
  });

  updateCounter();
}

// TAMBAH TODO
addBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Tugas tidak boleh kosong";

    return;
  }

  if (text.length < 3) {
    errorMessage.textContent = "Minimal 3 karakter";

    return;
  }

  if (text.length > 100) {
    errorMessage.textContent = "Maksimal 100 karakter";

    return;
  }

  errorMessage.textContent = "";

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    priority: prioritySelect.value,
  };

  todos.push(newTodo);

  saveTodos();
  renderTodos();

  todoInput.value = "";
});

// FILTER
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTodos();
  });
});

// HAPUS SEMUA SELESAI
clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);

  saveTodos();
  renderTodos();
});

// DRAG & DROP
todoList.addEventListener("dragover", (e) => {
  e.preventDefault();

  const draggingItem = document.querySelector(".dragging");

  const items = [...todoList.querySelectorAll(".todo-item:not(.dragging)")];

  const nextItem = items.find((item) => {
    return e.clientY <= item.offsetTop + item.offsetHeight / 2;
  });

  if (nextItem) {
    todoList.insertBefore(draggingItem, nextItem);
  } else {
    todoList.appendChild(draggingItem);
  }
});

// UPDATE URUTAN SETELAH DROP
todoList.addEventListener("drop", () => {
  const reorderedTodos = [];

  document.querySelectorAll(".todo-item").forEach((item) => {
    const index = item.dataset.index;

    reorderedTodos.push(todos[index]);
  });

  todos = reorderedTodos;

  saveTodos();
  renderTodos();
});

// ENTER TAMBAH TODO
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

// LOAD
renderTodos();
