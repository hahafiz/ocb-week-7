let page = 1;
let isLoading = false;
let currentSearchTerm = ""; // to store the search term
const API_KEY = "4494972-80e7da1d13b6a392e3f55474e";
const IMAGES_PER_PAGE = 15;

function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "loading-spinner";
  spinner.innerHTML = `
    <div class="d-flex justify-content-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;
  document.getElementById("grid").appendChild(spinner);
}

function removeLoadingSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.remove();
}

function renderImages(images) {
  const imgList = images
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

  const appContainer = document.getElementById("app");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = imgList;

  const newImages = Array.from(tempDiv.children);
  newImages.forEach((img) => appContainer.appendChild(img));

  // Reinitialize Masonry and imagesLoaded
  var grid = document.querySelector("#app");
  imagesLoaded(grid, function () {
    new Masonry(grid, {
      itemSelector: ".col",
      percentPosition: true,
    });

    removeLoadingSpinner();
    isLoading = false;
  });
}

async function fetchPixabayImages(pageNum, searchTerm = "") {
  // Prevent multiple simultaneous requests
  if (isLoading) return;

  isLoading = true;
  createLoadingSpinner();

  try {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("page", pageNum);
    url.searchParams.set("per_page", IMAGES_PER_PAGE);

    // add search term if provided
    if (searchTerm) {
      url.searchParams.set("q", searchTerm);
    }

    const response = await fetch(url);
    const body = await response.json();

    // clear existing content only on first page
    if (pageNum === 1) {
      document.getElementById("app").innerHTML = "";
    }

    // render images
    renderImages(body.hits);
  } catch (error) {
    console.log("Error fetching images: ", error);
    removeLoadingSpinner();
    isLoading = false;
  }
}

function searchImages() {
  // get current search term from either input field
  const newSearchTerm =
    document.getElementById("search-input").value.trim() ||
    document.getElementById("search-input-sticky").value.trim();

  // update the current search term
  currentSearchTerm = newSearchTerm;

  // sync search term to both search inputs
  document.getElementById("search-input").value = currentSearchTerm;
  document.getElementById("search-input-sticky").value = currentSearchTerm;

  // reset page and fetch images with search term
  page = 1;
  fetchPixabayImages(page, currentSearchTerm);

  // reset scroll position
  window.scrollTo(0, 0);
}

// Initial Load
fetchPixabayImages(page);

// search bar event listeners
document
  .getElementById("search-button")
  .addEventListener("click", searchImages);
document
  .getElementById("search-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchImages();
    }
  });

document
  .getElementById("search-button-sticky")
  .addEventListener("click", searchImages);
document
  .getElementById("search-input-sticky")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchImages();
    }
  });

// Infinite scroll
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
    page++;
    fetchPixabayImages(page, currentSearchTerm);
  }
});

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
  if (scrollPosition < 300) {
    searchContainerAbsolute.style.display = "block";
    searchContainerSticky.style.display = "none";
  } else {
    searchContainerAbsolute.style.display = "none";
    searchContainerSticky.style.display = "block";
  }
});
