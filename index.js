// Importing the firebase services for data operations
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// Importing database functions from the firebase-database.js module
import {
    getDatabase, // Function to get a reference to the Firebase database
    ref, // Function to create a reference to a specific location in the database
    onValue, // Function to listen for changes to the value of a specified path in the database
    push, // Function to push data to a specified path in the database
    remove, // Function to remove data from a specified path in the database
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase app configuration
let appSettings = {
    databaseURL:
        "https://shoppingcartlist-6f96d-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize the firebase app
let app = initializeApp(appSettings);
let database = getDatabase(app);
let shoppingListDB = ref(database, "shoppingList");

// Get DOM Elements
let input = document.getElementById("input-field");
let addBtn = document.getElementById("add-button");
let notificationContainer = document.getElementById("notification-container");
let shoppingListContainer = document.querySelector(".shoppingListContainer");

// Event listener for add button click
addBtn.addEventListener("click", function () {
    let value = input.value.trim();
    if (value === "") {
        displayNotification("Field is empty!");
        return;
    }

    // Push new item to the shopping list by calling the push function from firebase database
    push(shoppingListDB, value);
    // Display notification
    displayNotification(`${value} has been added to the list!`);
    // Clear input field
    input.value = "";
});

// Function to display notifications
function displayNotification(msg) {
    notificationContainer.innerText = msg;

    // remove the "hide" class from the notification container
    notificationContainer.classList.remove("hide");

    // add the "hide" class from the notification container after 3 seconds
    setTimeout(() => {
        notificationContainer.classList.add("hide");
    }, 3000);
}

// Event listener for changes in the shopping list data
onValue(shoppingListDB, function (snapshot) {
    // Retrieve the shopping list data from the snapshot
    const shoppingList = snapshot.val();

    if (shoppingList) {
        let html = "";
        // Generate HTML for each item in the shopping list
        Object.keys(shoppingList).forEach((itemId) => {
            const itemName = shoppingList[itemId];
            html += `<div class="item" data-id="${itemId}">${itemName}</div>`;
        });
        // Update the shopping list container with the generated HTML
        shoppingListContainer.innerHTML = html;
    } else {
        // Display a message if the shopping list is empty
        shoppingListContainer.innerHTML = `<div>Shopping List is empty</div>`;
    }
});

// Event listener for item removal
shoppingListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("item")) {
        // Assign the target's data-id to itemID
        let itemID = e.target.getAttribute("data-id");
        // Remove the selected item from the shopping list
        remove(ref(database, `shoppingList/${itemID}`));
    }
});
