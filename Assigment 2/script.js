// Medicine tracker for assignment 2

// base product class that medicine inherits from
class Product {
    constructor(name, id, manufacturer) {
        this.name = name;
        this.id = id;
        this.manufacturer = manufacturer;
    }
    
    // check if product has required fields
    validate() {
        return this.name && this.id && this.manufacturer;
    }
}

// medicine class that extends product
class Medicine extends Product {
    constructor(name, id, manufacturer, expirationDate, quantity) {
        super(name, id, manufacturer);
        this.expirationDate = expirationDate;
        this.quantity = quantity;
    }
    
    // validate medicine has all required fields including expiry and quantity
    validate() {
        return super.validate() && this.expirationDate && this.quantity > 0;
    }
}

// main class to manage the medicine inventory
class InventoryManager {
    constructor() {
        this.medicines = [];
        this.loadFromStorage();
    }
    
    // generate unique ID for each medicine
    generateId() {
        return `MED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // add new medicine to inventory
    addMedicine(name, manufacturer, expirationDate, quantity) {
        // check if medicine already exists
        const existing = this.medicines.find(med => 
            med.name.toLowerCase() === name.toLowerCase() && 
            med.manufacturer.toLowerCase() === manufacturer.toLowerCase()
        );
        
        if (existing) throw new Error('This medicine already exists!');
        
        // create new medicine and validate
        const medicine = new Medicine(name, this.generateId(), manufacturer, expirationDate, parseInt(quantity));
        if (!medicine.validate()) throw new Error('Please fill all fields!');
        
        this.medicines.push(medicine);
        this.saveToStorage();
        return medicine;
    }
    
    // remove medicine from inventory
    deleteMedicine(id) {
        const index = this.medicines.findIndex(med => med.id === id);
        if (index !== -1) {
            this.medicines.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    // get all medicines in inventory
    getAllMedicines() {
        return this.medicines;
    }
    
    // save medicines to localStorage
    saveToStorage() {
        localStorage.setItem('medicines', JSON.stringify(this.medicines));
    }
    
    // load medicines from localStorage when page loads
    loadFromStorage() {
        const stored = localStorage.getItem('medicines');
        if (stored) {
            const data = JSON.parse(stored);
            this.medicines = data.map(item => new Medicine(item.name, item.id, item.manufacturer, item.expirationDate, item.quantity));
        }
    }
}

// create main inventory manager instance
const inventory = new InventoryManager();

// get DOM elements
const form = document.getElementById('medicine-form');
const tableBody = document.getElementById('inventory-tbody');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const noMedicinesDiv = document.getElementById('no-medicines');

// show error message to user
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

// show success message to user
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

// display all medicines in the table
function renderInventory() {
    const medicines = inventory.getAllMedicines();
    
    // show message if no medicines
    if (medicines.length === 0) {
        tableBody.innerHTML = '';
        noMedicinesDiv.classList.remove('hidden');
        return;
    }
    
    noMedicinesDiv.classList.add('hidden');
    
    // create table rows for each medicine
    tableBody.innerHTML = medicines.map(medicine => `
        <tr>
            <td>${medicine.id}</td>
            <td>${medicine.name}</td>
            <td>${medicine.manufacturer}</td>
            <td>${new Date(medicine.expirationDate).toLocaleDateString()}</td>
            <td>${medicine.quantity}</td>
            <td>
                <button class="delete-btn" onclick="deleteMedicine('${medicine.id}')">Remove</button>
            </td>
        </tr>
    `).join('');
}

// delete medicine with confirmation
function deleteMedicine(id) {
    if (confirm('Remove this medicine?')) {
        if (inventory.deleteMedicine(id)) {
            showSuccess('Medicine removed!');
            renderInventory();
        }
    }
}

// handle form submission to add new medicine
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // get form data
    const formData = new FormData(form);
    const name = formData.get('productName').trim();
    const manufacturer = formData.get('manufacturer').trim();
    const expirationDate = formData.get('expirationDate');
    const quantity = formData.get('quantity');
    
    // validate required fields
    if (!name || !manufacturer || !expirationDate || !quantity) {
        showError('Fill all fields!');
        return;
    }
    
    // validate quantity is positive
    if (parseInt(quantity) <= 0) {
        showError('Quantity must be more than 0!');
        return;
    }
    
    // validate expiration date is in future
    if (new Date(expirationDate) <= new Date()) {
        showError('Pick a future date!');
        return;
    }
    
    // try to add medicine
    try {
        inventory.addMedicine(name, manufacturer, expirationDate, quantity);
        showSuccess('Medicine added!');
        form.reset();
        renderInventory();
    } catch (error) {
        showError(error.message);
    }
});

// make delete function available globally for onclick
window.deleteMedicine = deleteMedicine;

// load and display medicines when page loads
renderInventory();