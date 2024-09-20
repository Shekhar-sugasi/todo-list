import './styles.css';

let projects = [];

class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }
    
    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
    }

    editName(newName) {
        this.name = newName;
    }
}

class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

document.getElementById('add-project').addEventListener('click', () => {
    console.log("Added project")
    const projectName = document.getElementById('new-project').value;
    if (projectName) {
        const newProject = new Project(projectName);
        projects.push(newProject);
        saveProjects();
        renderProjects();
        document.getElementById('new-project').value = '';
    }
});

function renderProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.innerHTML = `
            <span>${project.name}</span>
            <div>
            <button onclick="openTodoDialog(${index})">Add Todo</button>
            <button class="delete" onclick="deleteProject(${index})">Delete</button>
            <button class="edit" onclick="editProject(${index})">Edit</button>
            <div id="todo-list-${index}" class="todo-list"></div>
            </div>
        `;
        projectList.appendChild(projectCard);
        renderTodos(index);
    });
}

function openTodoDialog(projectIndex) {
    document.getElementById('todo-dialog').style.display = 'block';
    document.getElementById('submit-todo').onclick = () => {
        addTodoToProject(projectIndex);
    };
}

function addTodoToProject(projectIndex) {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const dueDate = document.getElementById('todo-due-date').value;
    const priority = document.getElementById('todo-priority').value;

    if (title && description && dueDate) {
        const newTodo = new Todo(title, description, dueDate, priority);
        projects[projectIndex].addTodo(newTodo);
        saveProjects();
        renderTodos(projectIndex);
        closeDialog();
    }
}

function closeDialog() {
    document.getElementById('todo-dialog').style.display = 'none';
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('todo-due-date').value = '';
    document.getElementById('todo-priority').value = 'low';
}

document.getElementById('close-dialog').onclick = closeDialog;

function renderTodos(projectIndex) {
    const todoList = document.getElementById(`todo-list-${projectIndex}`);
    todoList.innerHTML = '';
    projects[projectIndex].todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.innerHTML = `
            <span>${todo.title} (${todo.dueDate})</span>
            <button onclick="deleteTodo(${projectIndex}, ${index})">Delete</button>
        `;
        todoList.appendChild(todoItem);
    });
}

function deleteProject(index) {
    projects.splice(index, 1);
    saveProjects();
    renderProjects();
}

function deleteTodo(projectIndex, todoIndex) {
    projects[projectIndex].deleteTodo(todoIndex);
    saveProjects();
    renderTodos(projectIndex);
}

function saveProjects() {
    localStorage.setItem('projectList', JSON.stringify(projects));
}

function loadProjects() {
    const savedProjects = JSON.parse(localStorage.getItem('projectList'));
    if (savedProjects) {
        projects = savedProjects.map(projectData => {
            const project = new Project(projectData.name);
            projectData.todos.forEach(todoData => {
                const todo = new Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority
                );
                project.addTodo(todo);
            });
            return project;
        });
        renderProjects();
    }
}

window.openTodoDialog = openTodoDialog;
window.deleteProject = deleteProject;
window.deleteTodo = deleteTodo;
window.editProject = function(index) {
    const newName = prompt('Edit project name:', projects[index].name);
    if (newName) {
        projects[index].editName(newName);
        saveProjects();
        renderProjects();
    }
};

loadProjects();