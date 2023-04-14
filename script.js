const btnsAdd = document.querySelectorAll(".btn--add");
const forms = document.querySelectorAll("form");
const inputs = document.querySelectorAll(".item-input");
const lists = document.querySelectorAll(".items-list");
/* Funções */

const setLocalStorage = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getLocalStorage = function () {
  const data = localStorage.getItem("tasks");
  return JSON.parse(data);
};

const tasks = getLocalStorage() || {
  notStarted: [],
  inProgress: [],
  completed: [],
};

const showBtns = function (el) {
  el.closest(".category")
    .querySelector(".form-item")
    .querySelector(".btn--add")
    .classList.add("hidden");

  el.closest(".category")
    .querySelector(".form-item")
    .querySelector(".btn--done")
    .classList.remove("hidden");
};

const hideBtns = function (el) {
  el.closest(".category")
    .querySelector(".form-item")
    .querySelector(".btn--add")
    .classList.remove("hidden");

  el.closest(".category")
    .querySelector(".form-item")
    .querySelector(".btn--done")
    .classList.add("hidden");
};

const showForm = function (el) {
  el.closest(".category")
    .querySelector(".item-box")
    .classList.remove("no-height");
  el.closest(".category")
    .querySelector(".form-item")
    .querySelector(".item-input")
    .classList.remove("no-height");
};

const hideForm = function (el) {
  el.closest(".category").querySelector(".item-box").classList.add("no-height");
  el.closest(".category")
    .querySelector(".form-item")
    .querySelector(".item-input")
    .classList.add("no-height");
};

const addTempElement = function (type, index) {
  const tempElement =
    [
      ...document
        .querySelector(`[data-type='${type}']`)
        .querySelectorAll(".real-item"),
    ][index - 1] ||
    document.querySelector(`[data-type='${type}']`).querySelector(".main-gap");

  tempElement.insertAdjacentHTML(
    "afterend",
    `<div class="temp-element"></div>`
  );

  setTimeout(() => {
    document.querySelector(".temp-element").classList.add("no-height");
  }, 0);
};


/* Manipulação */

btnsAdd.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    showBtns(e.target);
    showForm(e.target);
  });
});

forms.forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formInput = e.target.closest("form").querySelector(".item-input");

    const id = Date.now() + "";

    if (!formInput.value) {
      formInput.classList.add("input-invalid");
      return;
    }

    const taskType = e.target.closest(".category").dataset.type;
    const task = {
      content: formInput.value,
      id,
    };

    tasks[taskType].push(task);
    setLocalStorage();
    renderTasks();

    hideBtns(e.target);
    hideForm(e.target);

    formInput.classList.add("hidden");

    setTimeout(() => {
      formInput.classList.remove("hidden");
    }, 100);

    formInput.value = "";
  });
});

inputs.forEach((input) => {
  input.addEventListener("input", function (e) {
    e.target.classList.remove("input-invalid");
  });
});

lists.forEach((list) => {
  list.addEventListener("click", function (e) {
    const item = e.target.closest(".real-item");
    if (!item) return;

    const btnEdit = item.querySelector(".icon-edit");
    const btnDelete = item.querySelector(".icon-delete");

    
    const itemInput = item.querySelector(".item-input");
    const itemId = item.dataset.id;
    const taskType = e.target.closest(".category").dataset.type;
    const editedItem = tasks[taskType].find((item) => +item.id === +itemId);
    const editedItemIndex = tasks[taskType].findIndex(
      (item) => +item.id === +itemId
    );

  
    if (e.target === btnEdit) {
      const animateForm = function () {
        itemInput
          .closest("form")
          .querySelector("input")
          .classList.remove("hidden");

        itemInput.closest("form").classList.remove("hidden");
        itemInput.closest("form").classList.add("item-form-temp");
        itemInput
          .closest("form")
          .querySelector(".btn--done")
          .classList.add("no-height");

        item.querySelector("p").classList.add("hidden");
        item.querySelector(".gap").classList.add("hidden");

        setTimeout(() => {
          itemInput
            .closest("form")
            .querySelector("i")
            .classList.remove("hidden");
          itemInput.closest("form").classList.remove("item-form-temp");
          itemInput
            .closest("form")
            .querySelector(".btn--done")
            .classList.remove("no-height");
        }, 0);
      };

      animateForm();
      itemInput.value = editedItem.content;
      const itemForm = item.querySelector(".item-form");

      const formSubmit = function (e) {
        e.preventDefault();
        editedItem.content = itemForm.querySelector(".item-input").value;

        item.querySelector("p").querySelector("span").textContent =
          editedItem.content;

        setLocalStorage();

        itemInput.closest("form").classList.add("item-form-temp-remove");
        itemInput
          .closest("form")
          .querySelector(".btn--done")
          .classList.add("no-height");

        itemInput.closest("form").querySelector("i").classList.add("hidden");

        setTimeout(() => {
          itemInput.closest("form").classList.remove("item-form-temp-remove");
          itemInput.closest("form").classList.add("hidden");
          item.querySelector(".gap").classList.remove("hidden");
          item.querySelector("p").classList.remove("hidden");
        }, 250);

        this.removeEventListener("submit", formSubmit);
        console.log(this);
        console.log(formSubmit);
      };

      
      itemForm.addEventListener("submit", formSubmit.bind(this));
    }

    
    if (e.target === btnDelete) {
      tasks[taskType].splice(editedItemIndex, 1);
      renderTasks();
      addTempElement(taskType, editedItemIndex);
      setLocalStorage();
    }
  });

  list.addEventListener("dragstart", function (e) {
    if (!e.target.closest(".real-item").classList.contains("real-item")) return;
    e.dataTransfer.setData(
      "text/plain",
      e.target.closest(".real-item").dataset.id
    );
  });
});

/* Arrastar e soltar */

const dragEnter = function (e) {
  e.preventDefault();
  e.target.classList.add("drop-over");
};
const dragOver = function (e) {
  e.preventDefault();
  e.target.classList.add("drop-over");
};
const dragLeave = function (e) {
  e.target.classList.remove("drop-over");
};

const drop = function (e) {
  e.target.classList.remove("drop-over");
  const id = e.dataTransfer.getData("text/plain");
  const draggedItemBox = document.getElementById(id).closest(".real-item");
  const draggedOverBox = e.target.closest(".real-item") || e.target;
  const draggedOverId = e.target.closest(".real-item")?.id;
  const draggedItemType = draggedItemBox.closest(".category").dataset.type;
  const draggedOverType = draggedOverBox.closest(".category").dataset.type;
  const draggedItemBoxIndex = tasks[draggedItemType].findIndex(
    (item) => item.id === draggedItemBox.id
  );

  const newTask = {
    content: draggedItemBox.querySelector("span").textContent,
    id: draggedItemBox.id,
  };

  if (e.target.classList.contains("main-gap")) {
    tasks[draggedItemType].splice(draggedItemBoxIndex, 1);
    tasks[draggedOverType].unshift(newTask);
  } else {
    tasks[draggedItemType].splice(draggedItemBoxIndex, 1);

    const newDraggedIndex =
      tasks[draggedOverType].findIndex(
        (item) => item.id === draggedOverBox.id
      ) + 1;

    tasks[draggedOverType].splice(newDraggedIndex, 0, newTask);
  }

  renderTasks();

  
  if (draggedItemType !== draggedOverType) {
    addTempElement(draggedItemType, draggedItemBoxIndex);
  }

  const animateLists = function () {
    const draggedItemBoxV2 = document.getElementById(id).closest(".real-item");
    const draggedOverBoxV2 =
      [
        ...document
          .querySelector(`[data-type='${draggedOverType}']`)
          .querySelectorAll(".real-item"),
      ].find((item) => item.id === draggedOverId) ||
      document
        .querySelector(`[data-type='${draggedOverType}']`)
        .querySelector(".main-gap");

    if (draggedOverBoxV2.classList.contains("main-gap")) {
      draggedOverBoxV2.classList.add("fixed-height");
    } else {
      draggedOverBoxV2.querySelector(".gap").classList.add("fixed-height");
    }

    draggedItemBoxV2.classList.add("hidden-opacity");

    setTimeout(() => {
      if (draggedOverBoxV2.classList.contains("main-gap")) {
        draggedOverBoxV2.classList.remove("fixed-height");
      } else {
        draggedOverBoxV2.querySelector(".gap").classList.remove("fixed-height");
      }

      draggedItemBoxV2.classList.remove("hidden-opacity");
      draggedItemBoxV2.classList.remove("no-height");
    }, 0);
  };

  animateLists();
  setLocalStorage();
};

const renderTasks = function () {
  const clearInnerHTML = (type) => {
    document.querySelector(`.${type}`).querySelector(".items-list").innerHTML =
      "";

    document
      .querySelector(`.${type}`)
      .querySelector(".items-list")
      .insertAdjacentHTML(
        "afterbegin",
        `<li><div class="gap main-gap"></div></li>`
      );
  };

  const createTask = function (task, type) {
    const itemsList = document
      .querySelector(`.${type}`)
      .querySelector(".items-list");

    const html = `
      <li class="real-item" data-id=${task.id} id=${task.id}>
      <div class="box">
        <div draggable="true">
            <p>
              <span>${task.content}</span>
              <i class="fa-regular fa-pen-to-square icon icon-edit"></i>
              <i class="fa-solid fa-trash icon icon-delete"></i>
            </p>
        </div>
          <div class="gap"></div>
      </div>
        <form class="hidden item-form">
          <input type="text" class="item-input no-margin" />
          <button type="submit" class="btn btn--done small-margin-bottom small-margin-top">
            <i class="fa-solid fa-check no-height hidden"></i>
          </button>
        </form>
      </li>
    `;

    itemsList.insertAdjacentHTML("beforeend", html);
  };

  clearInnerHTML("not-started");
  clearInnerHTML("in-progress");
  clearInnerHTML("completed");

  tasks.notStarted.forEach((task) => createTask(task, "not-started"));
  tasks.inProgress.forEach((task) => createTask(task, "in-progress"));
  tasks.completed.forEach((task) => createTask(task, "completed"));

  const gaps = document.querySelectorAll(".gap");
  gaps.forEach((item) => {
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("drop", drop);
  });
};

renderTasks();