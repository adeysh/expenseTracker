const earningsBtn = document.getElementById('earningsBtn');
const expenseBtn = document.getElementById('expenseBtn');
const transactionForm = document.getElementById('transactionForm');
const transactionsEl = document.getElementById('transactions');

const addTransactionCard = (formData, buttonType) => {
    const container = document.createElement("div");
    container.classList.add("card_container", "show");
    let status = "";
    let statusClass = "";
    if (buttonType === "credit") {
        status = "C";
        statusClass = "credit";
    } else {
        status = "D";
        statusClass = "debit";
    }
    // console.log(amount);
    const content = `
        <div class="card" onclick="showEdit(event)">
            <div class="details">
                <p>${formData.get("description")}</p>
                <p>${statusClass === "credit" ? "+" : statusClass === "debit" ? "-" : ""} ₹ ${Number(formData.get("amount"))}</p>
            </div>
            <div class="status ${statusClass}" id="status">
                ${status}
            </div>
        </div>
        <div class="showEditContainer">
            <div class="showEdit">
                <div class="edit">
                    <i class="fa-solid fa-pen-to-square" id="edit" style="color: #302d2d;" onclick="handleEditClick(event)"></i>
                </div>
                <div class=" delete">
                    <i class="fa-solid fa-trash" id="delete" style="color: #302d2d;" onclick="deleteCard(event);"></i>
                </div>
            </div>
        </div>
        `;

    container.innerHTML += content;
    transactionsEl.appendChild(container);
};

const updateTotalBalance = (totalBalance) => {
    const balance = document.getElementById('balance');
    let newBalance = Number(balance.innerText) + totalBalance;
    balance.innerText = newBalance;
};

const calculateBalance = (amount) => {
    let totalBalance = 0;
    totalBalance += amount;
    // console.log(totalBalance);
    updateTotalBalance(totalBalance);
};


const showEdit = (event) => {
    console.log(event.currentTarget.parentElement.children[1]);
    const card = event.currentTarget.parentElement;
    const showEditContainer = event.currentTarget.parentElement.children[1];
    if (showEditContainer.style.display === "none" || showEditContainer.style.display === "") {
        showEditContainer.style.display = "block";
    } else {
        showEditContainer.style.display = "none";
    }
};

const updateCardDetails = (card, form, amount, type) => {
    const descriptionElement = card.querySelector(".details p:first-child");
    const amountElement = card.querySelector(".details p:last-child");
    const statusElement = card.querySelector(".status");

    // Retrieve previous amount for balance adjustment
    const previousAmount = parseInt(amountElement.dataset.previousValue || 0);

    // Update the card details
    descriptionElement.textContent = form.get("description");
    amountElement.textContent = `${type === "credit" ? "+" : "-"} ₹ ${Math.abs(amount)}`;
    statusElement.textContent = type === "credit" ? "C" : "D";
    statusElement.className = `status ${type}`;

    // Adjust the balance by the difference
    calculateBalance(amount - previousAmount);
    amountElement.dataset.previousValue = amount;
};

const resetFormAndState = () => {
    transactionForm.description.value = "";
    transactionForm.amount.value = "";
    // cardToUpdate = null; // Reset the card-to-update state
};

const deleteCard = (event) => {
    console.log("delete card click");
};



let cardToUpdate = null;

const handleEditClick = (event) => {
    isUpdating = true; // Set the state to update
    cardToUpdate = event.currentTarget.closest(".showEditContainer").previousElementSibling;
    console.log("Edit mode activated for card:", cardToUpdate);
};

earningsBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const form = new FormData(transactionForm);
    const buttonType = earningsBtn.getAttribute("data-type");
    const amount = parseInt(form.get("amount"));
    console.log(cardToUpdate);
    if (cardToUpdate) {
        // If editing an existing card
        updateCardDetails(cardToUpdate, form, amount, "credit");
    } else {
        // Add a new card
        calculateBalance(amount);
        addTransactionCard(form, buttonType);
    }

    // Clear form and reset state
    resetFormAndState();
});

expenseBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const form = new FormData(transactionForm);
    const buttonType = expenseBtn.getAttribute("data-type");
    const amount = -parseInt(form.get("amount"));

    if (cardToUpdate) {
        // If editing an existing card
        updateCardDetails(cardToUpdate, form, amount, "debit");
    } else {
        // Add a new card
        calculateBalance(-amount);
        addTransactionCard(form, buttonType);
    }

    // Clear form and reset state
    resetFormAndState();
});