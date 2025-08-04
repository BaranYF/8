// Campus health center medicine tracker

class Product {
    constructor(name, id, manufacturer) {
        this.name = name;
        this.id = id;
        this.manufacturer = manufacturer;
    }
    
    validate() {
        return this.name && this.id && this.manufacturer;
    }
}

class Medicine extends Product {
    constructor(name, id, manufacturer, expirationDate, quantity) {
        super(name, id, manufacturer);
        this.expirationDate = expirationDate;
        this.quantity = quantity;
    }
    
    validate() {
        return super.validate() && this.expirationDate && this.quantity > 0;
    }
}

class InventoryManager {
    constructor() {
        this.medicines = [];
        this.loadFromStorage();
    }
    
    generateId() {
        return `MED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    addMedicine(name, manufacturer, expirationDate, quantity) {
        const existing = this.medicines.find(med => 
            med.name.toLowerCase() === name.toLowerCase() && 
            med.manufacturer.toLowerCase() === manufacturer.toLowerCase()
        );
        
        if (existing) throw new Error('This medicine already exists!');
        
        const medicine = new Medicine(name, this.generateId(), manufacturer, expirationDate, parseInt(quantity));
        if (!medicine.validate()) throw new Error('Please fill all fields!');
        
        this.medicines.push(medicine);
        this.saveToStorage();
        return medicine;
    }
    
    deleteMedicine(id) {
        const index = this.medicines.findIndex(med => med.id === id);
        if (index !== -1) {
            this.medicines.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    getAllMedicines() {
        return this.medicines;
    }
    
    saveToStorage() {
        localStorage.setItem('medicines', JSON.stringify(this.medicines));
    }
    
    loadFromStorage() {
        const stored = localStorage.getItem('medicines');
        if (stored) {
            const data = JSON.parse(stored);
            this.medicines = data.map(item => new Medicine(item.name, item.id, item.manufacturer, item.expirationDate, item.quantity));
        }
    }
}

const inventory = new InventoryManager();
const form = document.getElementById('medicine-form');
const tableBody = document.getElementById('inventory-tbody');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const noMedicinesDiv = document.getElementById('no-medicines');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function renderInventory() {
    const medicines = inventory.getAllMedicines();
    
    if (medicines.length === 0) {
        tableBody.innerHTML = '';
        noMedicinesDiv.classList.remove('hidden');
        return;
    }
    
    noMedicinesDiv.classList.add('hidden');
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

function deleteMedicine(id) {
    if (confirm('Remove this medicine?')) {
        if (inventory.deleteMedicine(id)) {
            showSuccess('Medicine removed!');
            renderInventory();
        }
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('productName').trim();
    const manufacturer = formData.get('manufacturer').trim();
    const expirationDate = formData.get('expirationDate');
    const quantity = formData.get('quantity');
    
    if (!name || !manufacturer || !expirationDate || !quantity) {
        showError('Fill all fields!');
        return;
    }
    
    if (parseInt(quantity) <= 0) {
        showError('Quantity must be more than 0!');
        return;
    }
    
    if (new Date(expirationDate) <= new Date()) {
        showError('Pick a future date!');
        return;
    }
    
    try {
        inventory.addMedicine(name, manufacturer, expirationDate, quantity);
        showSuccess('Medicine added!');
        form.reset();
        renderInventory();
    } catch (error) {
        showError(error.message);
    }
});

window.deleteMedicine = deleteMedicine;
renderInventory();