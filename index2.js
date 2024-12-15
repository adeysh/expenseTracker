const transactionForm = document.getElementById('transactionForm');

const state = {
    earnings: 0,
    expense: 0,
    net: 0,
    transactions: [
        // {
        //     id: 5,
        //     description: "demo",
        //     amount: 500,
        //     type: "credit"
        // },
        // {
        //     id: 6,
        //     description: "demo debit",
        //     amount: 400,
        //     type: "debit"
        // },
    ]
};


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
        console.log(transaction);

        const { amount, description, id, type } = transaction;
        const isCredit = type === "credit" ? true : false;
        const sign = isCredit ? "+" : "-";

        const cardContainerEl = `
        <div class="card_container" id="${id}">
            <div class="card">
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
                    <div class="edit">
                        <i class="fa-solid fa-pen-to-square" style="color: #302d2d;"></i>
                    </div>
                    <div class=" delete">
                        <i class="fa-solid fa-trash" style="color: #302d2d;"></i>
                    </div>
                </div>
            </div>
        </div>`;

        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;

        transactionsEl.insertAdjacentHTML("afterbegin", cardContainerEl);
    });

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
        id: Math.floor(Math.random() * 1000),
        description: description,
        amount: Number(amount),
        type: isEarn ? "credit" : "debit",
    };

    state.transactions.push(transaction);

    renderTransaction();

    // console.log(state);
}

renderTransaction();

transactionForm.addEventListener("submit", addTransaction);