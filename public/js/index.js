document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken || isTokenExpired(accessToken)) {
    sessionStorage.clear();
    window.location.href = "./login.html";
    return;
  }

  document.body.classList.remove("hidden");
  await fetchTodos();

  document.getElementById("add-task").addEventListener("submit", addTodo);
  document.getElementById("log-out").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.reload();
  });

  function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Math.floor(Date.now() / 1000) > payload.exp;
  }

  async function fetchTodos() {
    try {
      const user_id = sessionStorage.getItem("user_id");
      const response = await fetch(
        `http://localhost:8080/todo?user_id=${user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const todos = await response.json();
      renderTodoList(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  function renderTodoList(todos) {
    const todoList = document.getElementById("todo-list");
    if (Array.isArray(todos)) {
      todos.forEach((todo) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="task">${todo.task}</td>
            <td>${todo.priority}</td>
            <td>${todo.completed ? "Completed" : "Not Completed"}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        row
          .querySelector(".edit")
          .addEventListener("click", () => updateTodoModal(todo));
        row
          .querySelector(".delete")
          .addEventListener("click", () => deleteTodo(todo));
        todoList.appendChild(row);
      });
    }
  }

  async function addTodo(event) {
    event.preventDefault();

    const user_id = sessionStorage.getItem("user_id");
    const task = document.getElementById("task").value;
    const priority = document.getElementById("priority").value;
    const completed = document.getElementById("status").value;

    try {
      const response = await fetch("http://localhost:8080/todo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, task, priority, completed }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log({ message: result.message });
      window.location.reload();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  function updateTodoModal(todo) {
    const modal = document.getElementById("edit-modal");
    document.getElementById("edit-task").value = todo.task;
    document.getElementById("edit-priority").value = todo.priority;
    document.getElementById("edit-status").value = todo.completed;
    modal.style.display = "block";

    modal.querySelector(".close").onclick = () =>
      (modal.style.display = "none");
    window.onclick = (event) => {
      if (event.target === modal) modal.style.display = "none";
    };

    document.getElementById("edit-task-form").onsubmit = (event) =>
      updateTodo(event, todo._id, modal);
  }

  async function updateTodo(event, id, modal) {
    event.preventDefault();
    const updatedTodo = {
      task: document.getElementById("edit-task").value,
      priority: document.getElementById("edit-priority").value,
      completed: document.getElementById("edit-status").value,
    };
    try {
      const response = await fetch(`http://localhost:8080/todo/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      window.location.reload();
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      modal.style.display = "none";
    }
  }

  async function deleteTodo(todo) {
    try {
      const response = await fetch(`http://localhost:8080/todo/${todo._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log({ message: result.message });
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
