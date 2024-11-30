// HEADER ANIMATION
window.addEventListener("scroll", function () {
  const headerContainer = document.getElementById("header-container");
  const headerAnimation = document.getElementById("header-animation");
  const searchContainerAbsolute = document.getElementById(
    "search-filter-container-absolute"
  );
  const searchContainerSticky = document.getElementById(
    "search-filter-container-sticky"
  );
  // const gallery = document.getElementById("gallery");
  const scrollPosition = window.scrollY;

  // Calculate the blur amount based on scroll position
  // Adjust the divisor to controll how quickly the blur increases
  const blurAmount = Math.min(scrollPosition / 40, 40); // Maximum blur amount
  const scaleHeader = 1 - blurAmount / 100; // Scale the header

  // Apply blur to the header container
  headerContainer.style.filter = `blur(${blurAmount}px)`;
  headerContainer.style.webkitfilter = `blur(${blurAmount}px)`; // For Safari

  // Apply header text scale animation
  headerAnimation.style.transform = `scale(${scaleHeader})`;

  // get the top position of the gallery
  const galleryTop = gallery.getBoundingClientRect().top;

  // switch visibility of search containers
  if (scrollPosition < 350) {
    searchContainerAbsolute.style.display = "block";
    searchContainerSticky.style.display = "none";
  } else {
    searchContainerAbsolute.style.display = "none";
    searchContainerSticky.style.display = "block";
  }
});

var API_KEY = "4494972-80e7da1d13b6a392e3f55474e";

fetch("https://pixabay.com/api/?key=" + API_KEY)
  .then((response) => response.json())
  .then((body) => {
    const imgList = body.hits
      .map(
        (photo) =>
          `<div class="col image-hover-container">
            <div class="position-relative">
              <img src="${photo.webformatURL}" alt="${photo.tags}" class="card-img-top rounded img-fluid"/>
              <div class="image-overlay">
                <div class="overlay-content">
                  <img src="${photo.userImageURL}" alt="${photo.user}" class="rounded-circle" width="50" height="50" />
                  <p class="author">By: ${photo.user}</p>
                  <a href="${photo.pageURL}" target="_blank" class="btn btn-sm btn-light">View on Pixabay</a>
                </div>
              </div>
            </div>
          </div>`
      )
      .join(""); // Use join to convert array to string

    document.getElementById("app").innerHTML = imgList;

    // wait for images to load before initializing Masonry
    var grid = document.querySelector("#app");

    imagesLoaded(grid, function () {
      new Masonry(grid, {
        itemSelector: ".col",
        percentPosition: true,
      });
    });
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });
