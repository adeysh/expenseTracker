const earningsBtn = document.getElementById('earningsBtn');
const expenseBtn = document.getElementById('expenseBtn');
const transactionForm = document.getElementById('transactionForm');
const transactionsEl = document.getElementById('transactions');
// console.log(transactionForm);

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
        <div class="card">
            <div class="details">
                <p>${formData.get("description")}</p>
                <p>${statusClass === "credit" ? "+" : statusClass === "debit" ? "-" : ""} ₹ ${Number(formData.get("amount"))}</p>
            </div>
            <div class="status ${statusClass}" id="status">
                ${status}
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


earningsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    form = new FormData(transactionForm);
    // console.log(typeof form.get("amount"));
    calculateBalance(parseInt(form.get("amount")));
    const buttonType = earningsBtn.getAttribute("data-type");
    // console.log(buttonType);
    addTransactionCard(form, buttonType);
});
expenseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // console.log('expense');
    form = new FormData(transactionForm);
    calculateBalance(-parseInt(form.get("amount")));
    const buttonType = expenseBtn.getAttribute("data-type");
    addTransactionCard(form, buttonType);

});;;