const transactionForm = document.getElementById('transactionForm');
const descriptionInputEl = document.getElementById('description');
const amountInputEl = document.getElementById('amount');

const state = {
    earnings: 0,
    expense: 0,
    net: 0,
    transactions: [],
};

let isUpdate = false;
let tid;

function renderTransaction() {
    const transactionsEl = document.getElementById('transactions');
    const balanceEl = document.getElementById('balance');
    const earningEl = document.getElementById('earning');
    const expenseEl = document.getElementById('expense');

    const transactions = state.transactions;

    let earning = 0;
    let expense = 0;
    let net = 0;

    transactionsEl.innerHTML = "";
    transactions.forEach((transaction) => {

        const { amount, description, id, type } = transaction;
        const isCredit = type === "credit" ? true : false;
        const sign = isCredit ? "+" : "-";

        let cardContainerEl = /*html */`
            <div class="card_container" id="${id}" >
                <div class="card" onclick="showEdit(${id})">
                    <div class="details">
                        <p>${description}</p>
                        <p>${sign} ₹ ${amount}</p>
                    </div>
                    <div class="status ${isCredit ? "credit" : "debit"}">
                        ${isCredit ? "C" : "D"}
                    </div>
                </div>
                <div class="showEditContainer">
                    <div class="showEdit">
                        <div class="edit" onclick="handleUpdate(${id})">
                            <i class="fa-solid fa-pen-to-square" style="color: #302d2d;"></i>
                        </div>
                        <div class="delete" onclick="handleDelete(${id})">
                            <i class="fa-solid fa-trash" style="color: #302d2d;"></i>
                        </div>
                    </div>
                </div>
            </div>`;

        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;

        transactionsEl.insertAdjacentHTML("afterbegin", cardContainerEl);
        lastInsertedCardId = id;
    });

    cardContainerEl = document.getElementById(lastInsertedCardId);
    const card = cardContainerEl.querySelector(".card");

    if (card) {
        card.classList.add("appear");
        card.addEventListener("animationend", () => {
            card.classList.remove("appear");
        });
    }

    earningEl.innerText = earning;
    expenseEl.innerText = expense;
    balanceEl.innerText = net;
}

function addTransaction(event) {
    event.preventDefault();
    const isEarn = event.submitter.id === "earningsBtn" ? true : false;
    formData = new FormData(transactionForm);
    const tData = {};
    formData.forEach((value, key) => {
        tData[key] = value;
    });

    const { description, amount } = tData;

    const transaction = {
        id: isUpdate ? tid : Math.floor(Math.random() * 1000),
        description: description,
        amount: Number(amount),
        type: isEarn ? "credit" : "debit",
    };

    if (isUpdate) {
        const tIndex = state.transactions.findIndex((t) => t.id === tid);
        state.transactions[tIndex] = transaction;
        isUpdate = false;
        tid = null;
    } else {
        state.transactions.push(transaction);
    }

    renderTransaction();
}

function showEdit(id) {
    const selectedCard = document.getElementById(id);
    const showEditContainer = selectedCard.querySelector(".showEditContainer");

    if (showEditContainer.style.display === "none" || showEditContainer.style.display === "") {
        showEditContainer.style.display = "block";
    } else {
        showEditContainer.style.display = "none";
    }
}

function handleUpdate(id) {
    const transaction = state.transactions.find((t) => t.id === id);
    const { description, amount } = transaction;

    descriptionInputEl.value = description;
    descriptionInputEl.focus();
    amountInputEl.value = amount;
    tid = id;
    isUpdate = true;
}

function handleDelete(id) {
    const cardContainerEl = document.getElementById(id);

    if (cardContainerEl) {
        cardContainerEl.classList.add("disappear");
        cardContainerEl.addEventListener("animationend", () => {
            const filteredTransaction = state.transactions.filter((t) => t.id !== id);
            state.transactions = filteredTransaction;
            renderTransaction();
        });
    }
}


transactionForm.addEventListener("submit", (event) => {
    const balance = document.getElementById('balance');
    addTransaction(event);

    if (Number(balance.innerText) > 0) {
        balance.parentElement.style.color = "#188d1c";
    } else {
        balance.parentElement.style.color = "#ff1818";
    }

    transactionForm.reset();
});