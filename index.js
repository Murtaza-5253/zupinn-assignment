document.addEventListener("DOMContentLoaded", fetchAndPopulate);


async function fetchData(){
    try {
        const response = await fetch("http://13.201.41.5:8001/supertrend_data");
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("Failed to fetch data.");
        return null;
    }
}

function storeData(data) {
    localStorage.setItem("supertrendData", JSON.stringify(data));
}

function retrieveData() {
    const storedData = localStorage.getItem("supertrendData");
    if (storedData) {
        console.log("retrieved from local storagee")
        return JSON.parse(storedData);
    } else {
        return null;
    }
}

function clearLocalStorage() {
    localStorage.removeItem("supertrendData");
    alert("Local storage cleared.");
    // location.reload();
}



function populateTable(data) {

    if (!data) {
        console.error("Data is undefined or null");
        alert("Data is undefined or null");
        return;
    }
    data=[data];
    const table = document.querySelector("#data-table");
    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead");

    tableBody.innerHTML = "";
    tableHead.innerHTML = "";

    if (Array.isArray(data) && data.length === 0) {
        console.error("Data array is empty");
        alert("Data array is empty")
        return;
    }

    const keys = Object.keys(data[0]);
    const headerRow = document.createElement("tr");
    keys.forEach(key => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);
    data.forEach(obj => {
        const row = document.createElement("tr");
        keys.forEach(key => {
            const td = document.createElement("td");
            td.textContent = obj[key];
            row.appendChild(td);
        });
        tableBody.appendChild(row);
    });
}

async function fetchAndPopulate() {
    let storedData = retrieveData();

    // If data is not available in local storage, fetch it from API
    if (!storedData) {
        storedData = await fetchData();
        if (storedData) {
            // Store fetched data in local storage
            storeData(storedData);
        }
    }

    // Populate table with data
    if (storedData) {
        populateTable(storedData);
    }
}