// document.addEventListener("DOMContentLoaded", function() {
//     // Get references to the buttons and the modal
//     var antarcticButton = document.getElementById('antarcticButton');
//     var arcticButton = document.getElementById('arcticButton');
//     var worldButton = document.getElementById('worldButton');
//     var continueButton = document.getElementById('continueButton');
//     var modal = document.getElementById('pgcModal');
  
//     // Store the intended destination
//     var destination;
  
//     // Define a function to show the modal and set the destination
//     function showModalAndSetDestination(event, url) {
//       event.preventDefault(); // Prevent the button from doing its default action
//       destination = url; // Store the destination
//       modal.style.display = 'block'; // Show the modal
//     }
  
//     // Define a function to hide the modal and navigate to the destination
// function continueWithoutLogin(event) {
//     event.preventDefault(); // Prevent the button from doing its default action
//     modal.style.display = 'none'; // Hide the modal
//     sessionStorage.setItem('keycloakInitiated', 'false'); // Set the keycloakInitiated to false
//     window.location.href = destination; // Navigate to the destination
// }

// // Define a function to hide the modal, set keycloakInitiated to true and navigate to the destination
// function loginAndNavigate(event) {
//     event.preventDefault(); // Prevent the button from doing its default action
//     modal.style.display = 'none'; // Hide the modal
//     sessionStorage.setItem('keycloakInitiated', 'true'); // Set the keycloakInitiated to true
//     window.location.href = destination; // Navigate to the destination
// }

// // Add an event listener to the "Login" button
// var loginButton = document.getElementById('loginButton');
// loginButton.addEventListener('click', loginAndNavigate);

  
//     // Define a function to close the modal
//     function closeModal(modalId) {
//       var modal = document.getElementById(modalId);
//       if (modal) {
//           modal.style.display = "none";
//       }
//     }
  
//     // Attach event listeners to the buttons
//     antarcticButton.addEventListener('click', function(event) {
//       showModalAndSetDestination(event, 'antarctica.html');
//     });
//     arcticButton.addEventListener('click', function(event) {
//       showModalAndSetDestination(event, 'arctic.html');
//     });
//     worldButton.addEventListener('click', function(event) {
//       showModalAndSetDestination(event, 'world.html');
//     });
//     continueButton.addEventListener('click', continueWithoutLogin);
  
//     // Attach closeModal function to the global scope (window object)
//     window.closeModal = closeModal;
//   });
  
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
  }
  
  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
  }
  
  
  