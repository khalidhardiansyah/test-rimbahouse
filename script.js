const FetchData = async (url, method = "GET") => {
  const res = await fetch(`http://127.0.0.1:8000/api/${url}`, { method });
  return res.json();
};

window.addEventListener("DOMContentLoaded", async () => {
  let data = await FetchData("users");
  console.log(data);

  const tbody = document.querySelector("tbody");

  const overlay = document.querySelector("#overlay");
  tbody.innerHTML = data.data
    .map(
      (item) => `<tr>
          <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
          ${item.name}
          </td>
          <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
          ${item.email}
          </td>
          <td class="px-3 py-4 text-sm text-gray-500 sm:table-cell">
          ${item.age}
          </td>
          <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <button class="text-indigo-600 hover:text-indigo-900"  data-id="${item.id}" id="editBtn">Edit</button>
          <button class="text-red-600 hover:text-red-900"  data-id="${item.id}" id="deleteBtn">Delete</button>
          </td>
          </tr>`
    )
    .join("");
  const deleteBtn = document.querySelectorAll("#deleteBtn");
  const editBtn = document.querySelectorAll("#editBtn");
  const closeBtn = document.querySelector("#closeBtn");
  const addBtn = document.querySelector("#addBtn");
  const form = document.querySelector("#form");
  const h1 = document.querySelector("#h1");
  const alert = document.querySelector("#alert");
  const alertContent = document.querySelector("#alertContent");
  const btnCloseAlert = document.querySelector("#btnCloseAlert");

  let id;
  let formAddData;

  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", async function () {
      const id = this.dataset.id;
      await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE",
      });
      window.location.reload();
    });
  });
  editBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let formAddData = false;
      id = this.dataset.id;
      h1.textContent = formAddData ? "Tambahkan Data" : "Edit Data";
      overlay.classList.toggle("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.toggle("hidden");
    formAddData = null;
  });

  addBtn.addEventListener("click", function () {
    let formAddData = true;
    h1.textContent = formAddData ? "Tambahkan Data" : "Edit Data";
    overlay.classList.toggle("hidden");
  });

  form.addEventListener("submit", async function (e) {
    e.stopPropagation();
    e.preventDefault();

    const formdata = new FormData(form);
    const dataObject = Object.fromEntries(formdata.entries());

    const urlBase = "http://127.0.0.1:8000/api/users";
    const response = await fetch(urlBase, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObject),
    });

    const result = await response.json();

    if (response.status === 200) {
      alert.classList.remove("hidden");
      alertContent.textContent = result.message;
      overlay.classList.remove("hidden");
      window.location.reload();
    } else if (!response.ok) {
      const errors = Object.entries(result.errors);
      errors.forEach((msg) => {
        const errorElement = document.querySelector(`#error-${msg[0]}`);
        if (errorElement) {
          errorElement.textContent = msg[1];
        }
      });
    }
  });

  btnCloseAlert.addEventListener("click", () => {
    alert.classList.toggle("hidden");
  });
});
