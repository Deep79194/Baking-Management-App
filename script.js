'use strict';

alert(
  'user list: \n user1:dp pin:1111 \n user2:hp pin:2222 \n user3:rp pin:3333 \n user4:kp pin:4444 \n user4:ds pin:5555'
);

// Data
const account1 = {
  owner: 'Deep Patel',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Het Patel',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Rahul Patel',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Kashyap Patel',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Dhairya Shah',
  movements: [
    30000, 40000, -25000, 20000, -50000, 100000, 200000, -50000, 300000,
  ],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const movementsRow = document.querySelector('.movements__row');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let accountStatement = function (account, sort = false) {
  const mov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  mov.forEach(function (v, index) {
    let operation = v > 0 ? 'deposit' : 'withdrawal';

    let html = ` <div class="movements__row">
  <div class="movements__type movements__type--${operation}">${index} ${operation}</div>
  <div class="movements__value">${v}</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display info
const displayInfo = function (currentAccount) {
  //display calculation
  calBalance(currentAccount);
  //display summury
  displaySummmary(currentAccount);
  //display Statements
  accountStatement(currentAccount);
};
//calculate balance

let calBalance = function (account) {
  let val = account.movements.reduce((acc, v) => acc + v, 0);
  account.amount = val;
  labelBalance.innerHTML = account.amount;
};

//computing username

let computeUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(v => v[0])
      .join('');
  });
};

computeUsername(accounts);
console.log(accounts);

//DisplaySummary

let displaySummmary = function (acc) {
  const displayIn = acc.movements
    .filter(v => v > 0)
    .reduce((acc, v) => acc + v, 0);
  labelSumIn.innerHTML = `${displayIn} ₹`;

  const displayOut = acc.movements
    .filter(v => v < 0)
    .reduce((acc, v) => acc + v, 0);
  labelSumOut.innerHTML = `${Math.abs(displayOut)} ₹`;

  const displayInterest = acc.movements
    .filter(v => v > 0)
    .map(v => (v * acc.interestRate) / 100)
    .filter(v => v > 1)
    .reduce((acc, v) => acc + v, 0);
  labelSumInterest.innerHTML = `${displayInterest} ₹`;
};

//login functionality
var currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  let pin = Number(inputLoginPin.value);
  if (currentAccount?.pin === pin) {
    //display username
    labelWelcome.textContent = `welcome, ${currentAccount.owner
      .split(' ')[0]
      .toLowerCase()}`;

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //display content
    containerApp.style.opacity = 100;

    displayInfo(currentAccount);
    e.preventDefault();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amt = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(transferAccount, amt, currentAccount);

  if (
    currentAccount.amount > amt &&
    amt > 0 &&
    transferAccount &&
    transferAccount.owner !== currentAccount.owner
  ) {
    currentAccount.movements.push(-amt);
    transferAccount.movements.push(amt);

    displayInfo(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
    currentAccount.movements.push(loanAmount);

    displayInfo(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const DeleteUser = inputCloseUsername.value;
  console.log(DeleteUser);
  const currentIndex = accounts.findIndex(acc => acc.username === DeleteUser);
  const currentPin = Number(inputClosePin.value);

  if (
    currentAccount.username === accounts[currentIndex].username &&
    currentAccount.pin === currentPin
  ) {
    //For Deleting account
    accounts.splice(currentIndex, 1);

    //For logout using transperancy
    containerApp.style.opacity = 0;
  }
});
