const workers = [];

let selectedWorkerId = null;

// Fetch JSON data
fetch("data.json")
  .then((response) => response.json())
  .then((workers) => {
    const table = document.getElementById("workerTable");
    const tableBody = document.getElementById("tableBody");
    const searchInput = document.getElementById("searchInput");
    const nameStartsWithInput = document.getElementById("nameStartsWith");
    const ageBelowInput = document.getElementById("ageBelow");
    const departmentSelect = document.getElementById("department");
    const filterButton = document.getElementById("filterButton");
    const clearFiltersButton = document.getElementById("clearFiltersButton");

    let filteredWorkers = workers; // Store the filtered workers

    function populateTable(workersData) {
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = ""; // Clear the table body before re-populating with data

      workersData.forEach((worker) => {
        const row = tableBody.insertRow();
        const idCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const surnameCell = row.insertCell(2);
        const genderCell = row.insertCell(3);
        const ageCell = row.insertCell(4);
        const workingYearsCell = row.insertCell(5);
        const departmentCell = row.insertCell(6);
        const emailCell = row.insertCell(7);

        idCell.textContent = worker.id;
        nameCell.textContent = worker.name;
        surnameCell.textContent = worker.surname;
        genderCell.textContent = worker.gender;
        ageCell.textContent = worker.age;
        workingYearsCell.textContent = worker.workingYears;
        departmentCell.textContent = worker.department;
        emailCell.textContent = worker.email;

        const modifyBtn = document.createElement("button");
        modifyBtn.classList.add("btn", "btn-primary", "btn-sm");
        modifyBtn.onclick = () => openModifyModal(worker);
        modifyBtn.textContent = "Modify";

        const modifyCell = row.insertCell(8);
        modifyCell.appendChild(modifyBtn);
      });
    }

    populateTable(filteredWorkers); // Initial population of the table with all workers

    function openModifyModal(worker) {
      console.log("worker object:", worker);

      document.getElementById("modifyWorkerModal").style.display = "block";
      console.log("openModifyModal called with worker:", worker);
      selectedWorkerId = worker.id;
      // Populate the modal fields with worker details
      document.getElementById("newName").value = worker.name;
      console.log("newName set to:", worker.name);
      document.getElementById("newSurname").value = worker.surname;
      document.getElementById("newGender").value = worker.gender;
      document.getElementById("newAge").value = worker.age;
      document.getElementById("newWorkingYears").value = worker.workingYears;
      document.getElementById("newDepartment").value = worker.department;
      document.getElementById("newEmail").value = worker.email;

      // Show the modify worker modal
      $("#modifyWorkerModal").modal("show");
    }

    const el = document.getElementById("modifyWorkerForm");
    el.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get values from the form
      const newName = document.getElementById("newName").value.trim();
      const newSurname = document.getElementById("newSurname").value.trim();
      const newGender = document.getElementById("newGender").value.trim();
      const newAge = document.getElementById("newAge").value.trim();
      const newWorkingYears = document
        .getElementById("newWorkingYears")
        .value.trim();
      const newDepartment = document
        .getElementById("newDepartment")
        .value.trim();
      const newEmail = document.getElementById("newEmail").value.trim();

      // Update the worker's details in the workers array
      workers.forEach((worker) => {
        if (worker.id === selectedWorkerId) {
          worker.name = newName;
          worker.surname = newSurname;
          worker.gender = newGender;
          worker.age = newAge;
          worker.workingYears = newWorkingYears;
          worker.department = newDepartment;
          worker.email = newEmail;
        }
      });

      // Close the modify worker modal
      $("#modifyWorkerModal").modal("hide");

      // Repopulate the table with updated data
      populateTable(workers);
    });

    // Event listener for the search input
    searchInput.addEventListener("input", function (event) {
      const searchTerm = event.target.value.trim().toLowerCase();
      filteredWorkers = workers.filter((worker) => {
        const { name, surname, email } = worker;
        return (
          name.toLowerCase().includes(searchTerm) ||
          surname.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm)
        );
      });
      applyFilters();
    });

    // Event listener for the add worker form submission
    document
      .getElementById("addWorkerForm")
      .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        // Get values from the form
        const newName = document.getElementById("newName").value.trim();
        // Retrieve other form fields and validate them
        const newSurname = document.getElementById("newSurname").value.trim();
        const newGender = document.getElementById("newGender").value.trim();
        const newAge = document.getElementById("newAge").value.trim();
        const newWorkingYears = document
          .getElementById("newWorkingYears")
          .value.trim();
        const newDepartment = document
          .getElementById("newDepartment")
          .value.trim();
        const newEmail = document.getElementById("newEmail").value.trim();

        // Add new worker to the workers array (Replace this with your logic to add a new worker)
        const newWorker = {
          id: workers.length + 1, // Replace with proper ID assignment logic
          name: newName,
          surname: newSurname,
          gender: newGender,
          age: newAge,
          workingYears: newWorkingYears,
          department: newDepartment,
          email: newEmail,
        };
        workers.push(newWorker); // Add the new worker to the data array

        // Close the modal
        $("#addWorkerModal").modal("hide");

        // Repopulate the table with updated data
        populateTable(workers);
      });

    // Initial population of the table
    populateTable(workers);

    // Event listener for the filter button
    filterButton.addEventListener("click", applyFilters);

    // Function to apply advanced filters
    function applyFilters() {
      let tempWorkers = filteredWorkers.slice(); // Create a copy to apply filters

      const nameStartsWith = nameStartsWithInput.value.trim().toLowerCase();
      if (nameStartsWith) {
        tempWorkers = tempWorkers.filter((worker) =>
          worker.name.toLowerCase().startsWith(nameStartsWith)
        );
      }

      const ageBelow = parseInt(ageBelowInput.value);
      if (!isNaN(ageBelow)) {
        tempWorkers = tempWorkers.filter((worker) => worker.age < ageBelow);
      }

      const selectedDepartment = departmentSelect.value.trim().toUpperCase();
      if (selectedDepartment && selectedDepartment !== "SELECT DEPARTMENT") {
        tempWorkers = tempWorkers.filter(
          (worker) => worker.department.toUpperCase() === selectedDepartment
        );
      }

      populateTable(tempWorkers); // Update the table with filtered data
    }

    // Event listener for the clear filters button
    clearFiltersButton.addEventListener("click", function () {
      nameStartsWithInput.value = "";
      ageBelowInput.value = "";
      departmentSelect.value = "";
      filteredWorkers = workers;
      applyFilters();
    });
  })
  .catch((error) => console.log(error));
