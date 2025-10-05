// Global Variables to keep track of expenses
 
let expenses = [];
let totalExpense = 0;
let dininingTotal = 0;
let expenseChart = null;  // Store the chart instance here

// Add Expense
function addExpense() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    // Validate the inputs
    if (!description || isNaN(amount) || amount <= 0 || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Create the expense object
    const expense = {
        description,
        amount,
        date,
        category
    };

    // Add expense to the array
    expenses.push(expense);

    // Update the totals
    updateCategoryTotals();
    updateExpenseList();
    updateTotalExpense();
}

// Update category-wise totals
function updateCategoryTotals() {
    diningTotal = expenses.filter(exp => exp.category === "Dining").reduce((sum, exp) => sum + exp.amount, 0);
    shoppingTotal = expenses.filter(exp => exp.category === "Shopping").reduce((sum, exp) => sum + exp.amount, 0);
    groceriesTotal = expenses.filter(exp => exp.category === "Groceries").reduce((sum, exp) => sum + exp.amount, 0);

    document.getElementById('dining-total').innerText = diningTotal.toFixed(2);
    document.getElementById('shopping-total').innerText = shoppingTotal.toFixed(2);
    document.getElementById('groceries-total').innerText = groceriesTotal.toFixed(2);
}

// Update the total expense
function updateTotalExpense() {
    totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('total-expense').innerText = totalExpense.toFixed(2);
}

// Update the expense list on the screen
function updateExpenseList() {
    const expenseListContainer = document.getElementById('expense-list');
    expenseListContainer.innerHTML = '';  // Clear the list before updating

    expenses.forEach((exp, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-item');

        expenseItem.innerHTML = `
            <span>${exp.description} - $${exp.amount.toFixed(2)} (${exp.category})</span>
            <button class="delete-button" onclick="deleteExpense(${index})">Delete</button>
        `;

        expenseListContainer.appendChild(expenseItem);
    });
}

// Delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);  // Remove the expense from the array
    updateCategoryTotals();     // Update category totals after deletion
    updateExpenseList();        // Re-render the updated expense list
    updateTotalExpense();       // Recalculate and update the total expense
}

// Show expenses in the list view
function showExpenses() {
    document.getElementById('expense-list').style.display = 'block';
    document.getElementById('chart-container').style.display = 'none';
}

// Show chart view
function showChart() {
    document.getElementById('expense-list').style.display = 'none';
    document.getElementById('chart-container').style.display = 'block';

    // Destroy the existing chart instance if it exists
    if (expenseChart) {
        expenseChart.destroy();
    }

    // Create the chart data
    const chartData = {
        labels: ['Dining', 'Shopping', 'Groceries'],
        datasets: [{
            data: [diningTotal, shoppingTotal, groceriesTotal],
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
            borderColor: ['#FF5733', '#33FF57', '#3357FF'],
            borderWidth: 1
        }]
    };

    // Initialize the chart
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });