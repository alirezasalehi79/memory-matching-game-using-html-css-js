// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  
  // Selecting necessary DOM elements
  const gridItems = document.querySelectorAll(".grid-item");
  const gridSchedule = document.querySelector(".grid-schedule");
  const numberOfMoves = document.querySelector(".move span");
  const playButton = document.querySelector(".start-game");
  const images = document.querySelectorAll("#info-image");
  const hintButton = document.getElementById("myBtn");
  const theTimer = document.querySelector(".timer").querySelector("#time");
  const afterLose = document.getElementById("lose");
  const afterLoseAlert = document.querySelector(".after-lose-alert");
  const afterWin = document.getElementById("win");
  const afterWinAlert = document.querySelector(".after-win-alert");
  const flippedItems = [];

  // Timer variables
  var timer = [0, 0, 0, 0];
  var timerRunnig = false;
  var interval;

  // Event listener for the play button
  playButton.addEventListener("click", () => {
    // Remove the starting message
    document.querySelector(".before-start").remove();
    // Start the timer
    interval = setInterval(runTimer, 10);
  });

  // Function to generate random numbers for shuffling images
  function generateRandomNumber() {
    const numbers = [];

    for (let i = 0; i < 20; i++) {
      numbers.push(i);
    }

    const randomNumbers = [];

    // Shuffle the numbers array and pick random indexes
    while (numbers.length > 0 && randomNumbers.length < 20) {
      let randomIndex = Math.floor(Math.random() * numbers.length);
      let randomNumber = numbers[randomIndex];
      randomNumbers.push(randomNumber);
      numbers.splice(randomIndex, 1);
    }
    return randomNumbers;
  }

  // Generate random indexes for shuffling images
  const randomIndexes = generateRandomNumber();

  // Shuffle the images based on random indexes
  const randomImages = [];
  for (let randomIndex of randomIndexes) {
    randomImages.push(images[randomIndex]);
  }

  // Assign shuffled images to grid items
  [...gridItems].forEach((gridItem, index) => {
    gridItem.appendChild(randomImages[index]);
  });

  // Function to add leading zero to timer values
  function leadingZero(time) {
    if (time <= 9) {
      time = `0${time}`;
    }
    return time;
  }

  // Function to run the timer
  function runTimer() {
    timer[0] = Math.floor(timer[3] / 100 / 60);
    timer[1] = Math.floor(timer[3] / 100) - timer[0] * 60;
    timer[3]++;

    let currentTime = `${leadingZero(timer[0])}:${leadingZero(timer[1])}`;

    theTimer.innerHTML = `Time Passed: ${currentTime}`;

    // Check if the game is lost
    if (
      flippedItems.length < 20 &&
      theTimer.innerHTML === "Time Passed: 02:00"
    ) {
      setTimeout(() => {
        afterLose.style.display = "block";
        afterLoseAlert.style.display = "block";
        clearInterval(interval);
      }, 300);
    }
  }

  // Add click event listeners to grid items
  gridItems.forEach((item) => {
    item.addEventListener("click", function () {
      flipItem(this);
    });
  });

  // Function to handle flipping of grid items
  function flipItem(selectedItem) {
    selectedItem.classList.add("flipped");

    const image = selectedItem.querySelector("#info-image");
    image.style.display = "block";
    image.style.backgroundColor = "#f3f3f3";

    let allFlippedItems = [...gridItems].filter((flippedItem) =>
      flippedItem.classList.contains("flipped")
    );

    // Check if two items are flipped and match
    if (allFlippedItems.length === 2) {
      stopClick();
      checkIfTheItemsMatch(allFlippedItems[0], allFlippedItems[1]);
    }
  }

  // Function to prevent clicking on grid items
  function stopClick() {
    gridSchedule.classList.add("no-click");

    setTimeout(() => {
      gridSchedule.classList.remove("no-click");
    }, 900);
  }

  // Function to check if flipped items match
  function checkIfTheItemsMatch(firstItem, secondItem) {
    let errorsElement1 = document.querySelector(".errors span");
    let errorElements2 = document.querySelector(".mistake span");

    const firstImage = firstItem.querySelector("#info-image");
    const secondImage = secondItem.querySelector("#info-image");

    if (firstImage.src === secondImage.src) {
      setTimeout(() => {
        // Increase number of moves
        numberOfMoves.innerHTML = parseInt(numberOfMoves.innerHTML) + 1;
        // Display matched items
        firstImage.style.display = "block";
        secondImage.style.display = "block";
        firstItem.classList.remove("flipped");
        secondItem.classList.remove("flipped");
        firstItem.classList.add("matched");
        secondItem.classList.add("matched");
        firstImage.style.opacity = "0.3";
        secondImage.style.opacity = "0.3";
        flippedItems.push(firstItem);
        flippedItems.push(secondItem);

        // Check if all items are matched
        if (flippedItems.length === 20) {
          setTimeout(() => {
            afterWin.style.display = "block";
            afterWinAlert.style.display = "block";
            clearInterval(interval);
          }, 300);
        }
      }, 900);
    } else {
      setTimeout(() => {
        // Increase number of moves and errors
        numberOfMoves.innerHTML = parseInt(numberOfMoves.innerHTML) + 1;
        errorsElement1.innerHTML = parseInt(errorsElement1.innerHTML) + 1;
        errorElements2.innerHTML = parseInt(errorElements2.innerHTML) + 1;
        firstImage.style.display = "none";
        secondImage.style.display = "none";
        firstItem.classList.remove("flipped");
        secondItem.classList.remove("flipped");
      }, 900);
    }
  }

  // Event listener for the hint button
  hintButton.addEventListener("click", () => {
    // Reset moves and errors
    numberOfMoves.innerHTML = 0;
    document.querySelector(".mistake span").innerHTML = 0;
    document.querySelector(".errors span").innerHTML = 0;
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0, 0];
    timerRunnig = false;
    document.querySelector(".down #myBtn span").innerHTML--;

    // Check if all hints are used
    if (document.querySelector(".down #myBtn span").innerHTML === "0") {
      setTimeout(() => {
        afterLose.style.display = "block";
        afterLoseAlert.style.display = "block";
        clearInterval(interval);
      }, 300);
    }
    // Reset timer
    theTimer.innerHTML = "Time Passed: 00:00";
    if (!timerRunnig) {
      timerRunnig = true;
      interval = setInterval(runTimer, 10);
    }

    // Reshuffle images
    const randomIndexes = generateRandomNumber();

    const randomImages = [];
    for (let randomIndex of randomIndexes) {
      randomImages.push(images[randomIndex]);
    }

    [...gridItems].forEach((gridItem, index) => {
      gridItem.appendChild(randomImages[index]);
    });

    // Reset matched class and image styles
    [...gridItems].forEach((item) => {
      item.classList.remove("matched");
    });

    [...images].forEach((image) => {
      image.style.display = "none";
      image.style.opacity = "1";
    });
  });
});