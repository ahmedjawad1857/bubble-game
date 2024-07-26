const max = 20;
let hit = 5;
let score = 0;
let timer = 60; // Initialize timer globally
let gameOver = false; // Flag to manage game state

const generateBubbles = () => {
  const container = document.getElementById("pbtm");
  const bubbleSize = 40; // Size of bubble in pixels
  const gap = 10; // Space between bubbles in pixels
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const bubblesPerRow = Math.floor(containerWidth / (bubbleSize + gap));
  const bubblesPerColumn = Math.floor(containerHeight / (bubbleSize + gap));

  const totalBubbles = bubblesPerRow * bubblesPerColumn;

  let clutter = "";
  for (let i = 0; i < totalBubbles; i++) {
    let rn = Math.floor(Math.random() * max);
    clutter += `<div class="bubble">${rn}</div>`;
  }

  container.innerHTML = clutter;
};

const updateTimer = () => {
  const interval = setInterval(() => {
    if (timer > 0) {
      timer--;
      document.getElementById("timerval").innerHTML = timer;
      localStorage.setItem("timer", timer); // Save timer to localStorage
    } else {
      clearInterval(interval);
      gameOver = true; // Set gameOver flag

      Swal.fire({
        position: "center",
        icon: "warning",
        title: `Time's up! You scored ${score} points.`,
        text: "Do you want to play again?",
        showCancelButton: true,
        confirmButtonText: "Play Again",
        cancelButtonText: "Cancel",
        allowOutsideClick: false, // Prevents closing when clicking outside
        allowEscapeKey: false, // Prevents closing with the escape key
      }).then((result) => {
        if (result.isConfirmed) {
          // Restart the game
          score = 0;
          timer = 60; // Reset timer
          document.getElementById("score").innerHTML = score;
          gameOver = false; // Reset gameOver flag
          generateBubbles();
          updateTimer();
          getNewHit();
          localStorage.setItem("score", score); // Save score to localStorage
          localStorage.setItem("timer", timer); // Save timer to localStorage
        } else {
          // Optionally handle cancel case
          const bottomPannel = document.getElementById("pbtm");
          bottomPannel.innerHTML = "";
          const resultElement = document.createElement("h1");
          resultElement.textContent = `Thanks for playing! Your final score is ${score}.`;
          bottomPannel.appendChild(resultElement);

          // Clear localStorage when game ends
          localStorage.removeItem("score");
          localStorage.removeItem("timer");
        }
      });
    }
  }, 1000);
};

function getNewHit() {
  // Logic to generate new hit target
  hit = Math.floor(Math.random() * max);
  document.getElementById("hitval").innerHTML = hit;
}

const increaseScore = () => {
  // increase the score by 10
  score += 10;
  document.getElementById("score").innerHTML = score;
  localStorage.setItem("score", score); // Save score to localStorage
};

const handleClick = (dets) => {
  if (gameOver) return; // Ignore clicks if game is over

  const target = Number(dets.target.textContent);

  if (target > 0 && target <= max && target === hit) {
    // If correct hit, increase score and generate new hit target
    increaseScore();
    generateBubbles();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "You have hit the right target...Now Focus on the next hit",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: "swal-popup-small",
        icon: "swal-icon-small",
        title: "swal-title-small",
      },
    });
  } else {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Wrong target! Try again and focus on next hit!",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: "swal-popup-small",
        icon: "swal-icon-small",
        title: "swal-title-small",
      },
    });
  }

  getNewHit();
};

// Add event listener for clicks
document.getElementById("pbtm").addEventListener("click", handleClick);

// Retrieve and set stored values on page load
window.onload = () => {
  const storedScore = localStorage.getItem("score");
  const storedTimer = localStorage.getItem("timer");

  if (storedScore !== null) {
    score = parseInt(storedScore, 10);
    document.getElementById("score").innerHTML = score;
  }

  if (storedTimer !== null) {
    timer = parseInt(storedTimer, 10);
    document.getElementById("timerval").innerHTML = timer;
    updateTimer(); // Start timer based on stored value
  } else {
    updateTimer(); // Start timer from scratch if no stored value
  }

  generateBubbles();
  getNewHit();
};

// Regenerate bubbles on window resize
window.onresize = generateBubbles;
