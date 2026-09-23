// Dynamic Dependent Row Management & Auto-Sync System

document.addEventListener("DOMContentLoaded", () => {
    // Attach live sync listeners to pre-existing rows in Page 2
    attachListenersToPage2();
    // Perform initial sync on load
    syncDependents();
});

function attachListenersToPage2() {
    const p2Table = document.getElementById("familyTable");
    if (!p2Table) return;

    const inputs = p2Table.querySelectorAll("tbody input");
    inputs.forEach(input => {
        input.removeEventListener("input", syncDependents);
        input.addEventListener("input", syncDependents);
    });
}

function addFamilyRow() {
    const tbody = document.querySelector("#familyTable tbody");
    if (!tbody) return;

    const rowCount = tbody.children.length;
    if (rowCount >= 10) {
        alert("Maximum limit of 10 dependents reached.");
        return;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${rowCount + 1}</td>
        <td><input type="text" placeholder="Relation / ಸಂಬಂಧ"></td>
        <td><input type="text" placeholder="Name / ಹೆಸರು"></td>
        <td><input type="date"></td>
        <td><input type="text" placeholder="Aadhaar / ಆಧಾರ್"></td>
        <td class="no-print"><button type="button" onclick="deleteRow(this)" class="btn-del">X</button></td>
    `;
    tbody.appendChild(tr);

    attachListenersToPage2();
    syncDependents();
}

function deleteRow(btn) {
    const row = btn.closest("tr");
    const tbody = row.parentElement;
    row.remove();

    // Re-index serial numbers in Page 2
    Array.from(tbody.children).forEach((tr, index) => {
        tr.children[0].textContent = index + 1;
    });

    syncDependents();
}

// Format YYYY-MM-DD from HTML date input into DD/MM/YYYY
function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function syncDependents() {
    // 1. Extract dependent data from Page 2
    const p2Rows = document.querySelectorAll("#familyTable tbody tr");
    const dependentsData = [];

    p2Rows.forEach(row => {
        const inputs = row.querySelectorAll("input");
        dependentsData.push({
            relation: inputs[0]?.value || "",
            name: inputs[1]?.value || "",
            dob: formatDateToDDMMYYYY(inputs[2]?.value || ""),
            aadhaar: inputs[3]?.value || ""
        });
    });

    // 2. Update Form B (Up to 8 rows)
    const formBRows = document.querySelectorAll("#formBTable tbody tr");
    formBRows.forEach((tr, index) => {
        const inputs = tr.querySelectorAll("input");
        if (index < dependentsData.length) {
            inputs[0].value = dependentsData[index].name;
            inputs[1].value = dependentsData[index].relation;
        } else {
            inputs[0].value = "";
            inputs[1].value = "";
        }
    });

    // 3. Update Form C (Up to 10 rows)
    const formCRows = document.querySelectorAll("#formCTable tbody tr");
    formCRows.forEach((tr, index) => {
        const inputs = tr.querySelectorAll("input");
        if (index < dependentsData.length) {
            inputs[0].value = dependentsData[index].name;
            inputs[1].value = dependentsData[index].relation;
            inputs[2].value = dependentsData[index].dob;
            inputs[4].value = dependentsData[index].aadhaar;
        } else {
            inputs[0].value = "";
            inputs[1].value = "";
            inputs[2].value = "";
            inputs[4].value = "";
        }
    });

    // 4. Update Summary Sheet (Up to 10 rows)
    const summaryRows = document.querySelectorAll("#summaryTable tbody tr");
    summaryRows.forEach((tr, index) => {
        const inputs = tr.querySelectorAll("input");
        if (index < dependentsData.length) {
            inputs[0].value = dependentsData[index].name;
            inputs[1].value = dependentsData[index].relation;
            inputs[2].value = dependentsData[index].dob;
            inputs[4].value = dependentsData[index].aadhaar;
        } else {
            inputs[0].value = "";
            inputs[1].value = "";
            inputs[2].value = "";
            inputs[4].value = "";
        }
    });
}
