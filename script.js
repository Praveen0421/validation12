let bool = true;
const addBtn = document.querySelector("#addBtn");
const form = document.querySelector("#form");
// add eventlisterner for displaying form as flex
addBtn.addEventListener("click", () => (form.style.display = "flex"));
// add eventlisterner for reset form
const resetBtn = document.querySelector("#cancel");
resetBtn.addEventListener("click", () => {
  form.reset();
});
// table
let table = document.querySelector("#table");
console.log(table);
let tableHeader = [
  { id: "#" },
  { name: "NAME" },
  { description: "DISCRIPTION" },
  { status: "STATUS" },
  { rate: "RATE" },
  { balance: "BALANCE" },
  { deposit: "DEPOSIT" },
  { action: "ACTION" },
];

const tHead = table.createTHead();
const tHeadRow = tHead.insertRow();
let tBody = table.createTBody();
tableHeader.forEach((element) => {
  let td = tHeadRow.insertCell();
  let key = Object.keys(element)[0];
  td.appendChild(document.createTextNode(element[key]));
});
// get data of customer
async function getCustomerData() {
  const noData = document.querySelector(".no-data-block");
  let response;
  let customerData;
  try {
    response = await fetch("http://localhost:3000/customer");
    customerData = await response.json();
    // check weather data is present
    if (customerData.length >= 1) {
      noData.style.display = "none";
    }
    createTableBody(customerData);
  } catch (error) {
    console.error(error);
  }
  //   switch function
  switchFunction();

  function createTableBody(responses) {
    table.removeChild(table.getElementsByTagName("tbody")[0]);
    tBody = table.createTBody();
    responses.forEach((value) => {
      let id = value.id;
      const tbRow = tBody.insertRow();
      tableHeader.forEach((element) => {
        const tbData = tbRow.insertCell();

        if (element.action !== "ACTION") {
          const key = Object.keys(element)[0];
          if (element.status === "STATUS") {
            let span = document.createElement("span");
            if (value.status === "Open") {
              span.setAttribute("class", "open");
              span.appendChild(document.createTextNode(value[key]));
            } else if (value.status === "Success") {
              span.setAttribute("class", "success");
              span.appendChild(document.createTextNode(value[key]));
            } else if (value.status === "Error") {
              span.setAttribute("class", "errorb");
              span.appendChild(document.createTextNode(value[key]));
            } else if (value.status === "Inactive") {
              span.setAttribute("class", "inactive");
              span.appendChild(document.createTextNode(value[key]));
            }
            tbData.appendChild(span);
          } else if (element.balance === "BALANCE") {
            let span = document.createElement("span");
            if (value.balance < 0) {
              span.setAttribute("class", "redColor");
              span.appendChild(document.createTextNode(value[key]));
            } else {
              span.setAttribute("class", "greenColor");
              span.appendChild(document.createTextNode(value[key]));
            }
            tbData.appendChild(span);
          } else {
            tbData.appendChild(document.createTextNode(value[key]));
            console.log(value[key]);
          }
        } else {
          let editBtn = document.createElement("button");
          editBtn.setAttribute("class", "editBtn");
          editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
          tbData.appendChild(editBtn);

          editBtn.addEventListener("click", () => editData(id));

          let deleteBtn = document.createElement("button");
          deleteBtn.setAttribute("class", "deleteBtn");
          deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
          tbData.appendChild(deleteBtn);

          deleteBtn.addEventListener("click", () => deleteData(id));
        }
      });
    });
  }
}
// function for adding data to the server
const submitBtn = document.querySelector("#save");
async function addResponse() {
  console.log("add");
  bool == true;
  const customerName = document.querySelector("#name").value;
  const description = document.querySelector("#description").value;
  const status = document.querySelector("#status").value;
  const rate = document.querySelector("#rate").value;
  const balance = Number(document.querySelector("#balance").value);
  const deposit = document.querySelector("#deposit").value;
  await fetch("http://localhost:3000/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name: customerName,
      description: description,
      status: status,
      rate: rate,
      balance: balance,
      deposit: deposit,
    }),
  });
  getCustomerData();
  form.reset();
  let inputt = document.querySelectorAll("input,select");
  inputt.forEach((element) => {
    element.style.borderColor = "grey";
  });
}

// function for editing
async function editData(id) {
  submitBtn.disabled=false;
  resetBtn.style.display = "none";
  form.style.display = "flex";
  console.log("edit");
  const updateBtn = document.querySelector("#save");
  updateBtn.innerHTML = "Update";
  bool = false;
  updateBtn.removeEventListener("click", addResponse);
  try {
    fetchValue = await fetch(`http://localhost:3000/customer/${id}`);
    const response = await fetchValue.json();
    document.querySelector("#name").value = response.name;
    document.querySelector("#description").value = response.description;
    document.querySelector("#status").value = response.status;
    document.querySelector("#rate").value = response.rate;
    document.querySelector("#balance").value = response.balance;
    document.querySelector("#deposit").value = response.deposit;
  } catch (error) {
    console.error(error);
  }
  switchFunction(id);
}
// update function

async function updateData(id) {
  resetBtn.style.display = "block";
  console.log("update");
  const updateBtn = document.querySelector("#save");
  const customerName = document.getElementById("name").value;
  const description = document.querySelector("#description").value;
  const status = document.querySelector("#status").value;
  const rate = document.querySelector("#rate").value;
  const balance = document.querySelector("#balance").value;
  const deposit = document.querySelector("#deposit").value;

  await fetch(`http://localhost:3000/customer/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: customerName,
      description: description,
      status: status,
      rate: rate,
      balance: balance,
      deposit: deposit,
    }),
  });
  getCustomerData();
  updateBtn.innerHTML = "Save";
  form.reset();
  bool = true;
  switchFunction();
  console.log("uupp");
  let inputt = document.querySelectorAll("input,select");
  inputt.forEach((element) => {
    element.style.borderColor = "grey";
  });
}

// function swith the function of submit btn
function switchFunction(id) {
  const updateBtn = document.querySelector("#save");
  if (bool == true) {
    console.log("run hua");
    updateBtn.removeEventListener("click", () => {
      updateData(id);
    });
    updateBtn.addEventListener("click", addResponse);
    submitBtn.disabled=true;
  } else if (bool == false) {
    console.log("change to sp");
    updateBtn.addEventListener("click", () => {
      updateData(id);
    });
  }
}
// function for deleting data
async function deleteData(id) {
  await fetch(`http://localhost:3000/customer/${id}`, {
    method: "DELETE",
  });
  getCustomerData();
}
// table body

// function
// form validation
const inputs = document.querySelectorAll("input,select");

let input1Valid = false;
let input2Valid = false;
let input3Valid = false;
let input4Valid = false;
let input5Valid = false;
let input6Valid = false;
inputs.forEach((element) => {
  element.addEventListener("blur", () => {
    let id = element.getAttribute("id");
    console.log(id);
    const customerName = document.querySelector("#name");
    const description = document.querySelector("#description");
    const status = document.querySelector("#status");
    const rate = document.querySelector("#rate");
    const balance = document.querySelector("#balance");
    const deposit = document.querySelector("#deposit");

    // regex
    const customerNameRegex = /^[A-Za-z][A-Za-z0-9]{3,50}[0-9]?$/;
    const descriptionRegex = /^[A-Za-z\s]{3,150}$/;
    const rateRegex = /^[0-9.]+$/;
    const balanceRegex = /^[0-9-.]+$/;
    const depositRegex = /^[0-9.]+$/;

    // name
    if (id === "name") {
      let message = document.querySelector("#nameError");
      if (customerName.value == "") {
        message.innerHTML = "Please fill the field";
        customerName.style.borderColor = "red";
        message.style.display = "flex";
        input1Valid = false;
      } else if (!customerNameRegex.test(customerName.value)) {
        message.innerHTML = "Please enter a valid name eg.Praveen123,praveen";
        customerName.style.borderColor = "red";
        message.style.display = "flex";
        input1Valid = false;
      } else {
        customerName.style.borderColor = "green";
        message.style.display = "none";
        input1Valid = true;
      }
    }

    // description

    if (id === "description") {
      let message = document.querySelector("#descriptionError");
      if (description.value == "") {
        message.innerHTML = "Please fill the field";
        description.style.borderColor = "red";
        message.style.display = "flex";
        input2Valid = false;
      } else if (!descriptionRegex.test(description.value)) {
        message.innerHTML =
          "Please only use Alphabate,minLength = 3,maxLength=150";
        description.style.borderColor = "red";
        message.style.display = "flex";
        input2Valid = false;
      } else {
        description.style.borderColor = "green";
        message.style.display = "none";
        input2Valid = true;
      }
    }
    // status

    if (id === "status") {
      let message = document.querySelector("#statusError");

      if (status.value === "" || status.value === "Select Status") {
        message.innerHTML = "Please select one option";
        status.style.borderColor = "red";
        message.style.display = "flex";
        input3Valid = false;
      } else {
        status.style.borderColor = "green";
        message.style.display = "none";
        input3Valid = true;
      }
    }
    // rate

    if (id === "rate") {
      let message = document.querySelector("#rateError");
      if (!rateRegex.test(rate.value)) {
        message.innerHTML = "Please fill the field";
        rate.style.borderColor = "red";
        message.style.display = "flex";
        input4Valid = false;
      } else {
        rate.style.borderColor = "green";
        message.style.display = "none";
        input4Valid = true;
      }
    }

    // balance
    if (id === "balance") {
      let message = document.querySelector("#balanceError");
      if (!balanceRegex.test(balance.value)) {
        message.innerHTML = "Please fill the field";
        balance.style.borderColor = "red";
        message.style.display = "flex";
        input5Valid = false;
      } else {
        balance.style.borderColor = "green";
        message.style.display = "none";
        input5Valid = true;
      }
    }
    //   deposit
    if (id === "deposit") {
      let message = document.querySelector("#depositError");
      if (!depositRegex.test(deposit.value)) {
        message.innerHTML = "Please fill the field";
        deposit.style.borderColor = "red";
        message.style.display = "flex";
        input6Valid = false;
      } else {
        deposit.style.borderColor = "green";
        message.style.display = "none";
        input6Valid = true;
      }
    }
    console.log(
      " input1Valid  " +
        input1Valid +
        "   input2Valid" +
        input2Valid +
        "  input3Valid " +
        input3Valid +
        "  input4Valid " +
        input4Valid +
        "  input5Valid" +
        input5Valid +
        "  input6Valid" +
        input6Valid
    );
    submitBtn.disabled = !(
      input1Valid &&
      input2Valid &&
      input3Valid &&
      input4Valid &&
      input5Valid &&
      input6Valid
    );
  });
});

window.onload(getCustomerData());
