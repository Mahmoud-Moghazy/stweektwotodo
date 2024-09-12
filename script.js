document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('new-task');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const massageDiv = document.querySelector('.massage-container');
  const errorMassageDiv = document.querySelector('.error-massage');
  const notificationContainer = document.querySelector('.notification-container');

  // Load tasks from localStorage, or initialize an empty array if none are stored
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Save tasks to localStorage
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Render all tasks to the task list
  const renderTasks = () => {
    taskList.innerHTML = ''; // Clear the current task list
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.className = task.completed ? 'completed' : '';
      taskItem.innerHTML = `
              <span>${task.text}</span>
              <button class="toggle-collapse" data-index="${index}">&#8286;</button>
              <div class="collapse" data-index="${index}">
                  <button class="edit-task" data-index="${index}">&#10000;</button>
                  <button class="delete-task" data-index="${index}">&#10006;</button>
                  <button class="toggle-complete" data-index="${index}">${task.completed ? '&#9851;' : '&#10003;'}</button>
              </div>`;
      taskList.appendChild(taskItem);
    });

    // Add event listeners for each task item
    document.querySelectorAll('.toggle-collapse').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        toggleCollapse(index);
      });
    });

    document.querySelectorAll('.delete-task').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        deleteTask(index);
      });
    });

    document.querySelectorAll('.edit-task').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        editTask(index);
      });
    });

    document.querySelectorAll('.toggle-complete').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        toggleComplete(index);
      });
    });
  };

  // Add a new task to the task list
  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
      toggleErrorMassage();
      setTimeout(() => {
        toggleErrorMassage();
      }, 5000);
      return;
    }
    tasks.push({ text: taskText, completed: false }); // Add new task with default incomplete status
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Clear input field after adding the task
    showNotification('Task added');
  };

  // Delete a task from the list by index
  const deleteTask = (index) => {
    tasks.splice(index, 1); // Remove task from the array
    saveTasks();
    renderTasks();
    showNotification('Task deleted');
  };

  // Edit an existing task
  const editTask = (index) => {
    const screenSize = window.innerWidth;
    if (screenSize <= 425) {
      toggleCollapse(index);  // Collapse task buttons if on small screen
    }

    const taskItem = document.querySelector(`li [data-index="${index}"]`).parentElement;
    const taskTextSpan = taskItem.querySelector('span');
    const currentText = tasks[index].text;

    // Create input element for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('edit-input');

    // Replace the span with the input
    taskTextSpan.replaceWith(input);
    input.focus(); // Automatically focus on the input for user convenience

    // Save or cancel edit on specific events
    input.addEventListener('blur', () => saveEdit(input, index));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveEdit(input, index);
      if (e.key === 'Escape') cancelEdit(input, taskTextSpan);
    });
  };

  // Save the edited task and update the UI
  const saveEdit = (input, index) => {
    const newTaskText = input.value.trim();
    if (newTaskText !== '') {
      tasks[index].text = newTaskText;
      saveTasks();
      renderTasks();
      showNotification('Task edited');
    } else {
      showNotification('Task text cannot be empty', true); // Error notification for empty task
      input.focus();
    }
  };

  // Cancel the task edit and restore the original text
  const cancelEdit = (input, taskTextSpan) => {
    input.replaceWith(taskTextSpan);
    showNotification('cancel task editing');
  };

  // Toggle the completion status of a task
  const toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed; // Toggle completion
    saveTasks();
    renderTasks();
    showNotification('Task status updated');
  };

  // Toggle the visibility of the collapse section for a task
  const toggleCollapse = (index) => {
    const collapseDiv = document.querySelector(`.collapse[data-index="${index}"]`);

    document.querySelectorAll('.collapse').forEach(collapseDiv => {
      if (collapseDiv.getAttribute('data-index') !== index) {
        collapseDiv.classList.remove('show');
      }
    });

    if (collapseDiv) {
      collapseDiv.classList.toggle('show'); // Toggle collapse
    }
  };

  // Display a notification message for the user
  const showNotification = (message) => {
    massageDiv.innerHTML = message;
    massageDiv.classList.add('notification-massage');
    showNotificationContainer();

    setTimeout(() => {
      massageDiv.innerHTML = '';
      massageDiv.classList.remove('notification-massage');
      notificationContainer.classList.remove('notification');
    }, 2000);
  };

  // Toggle the error message visibility
  const toggleErrorMassage = () => {
    errorMassageDiv.classList.toggle('show-massage');
  };

  // Show the notification container
  const showNotificationContainer = () => {
    notificationContainer.classList.add('notification');
  };

  // Event listener for adding a new task
  addTaskBtn.addEventListener('click', addTask);

  // Initial rendering of tasks on page load
  renderTasks();
});
