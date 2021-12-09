// This file contains all animations

$(document).ready(function () {
  // Start game animation
  $("#start-game").click(function () {
    // Hide first page
    $("#start-page").fadeOut("slow", function () {
      // Show game page
      $("#game-page").fadeIn("slow", function () {});
    });
  });

  


});

