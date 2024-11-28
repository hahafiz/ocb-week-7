var API_KEY = "4494972-80e7da1d13b6a392e3f55474e";

fetch("https://pixabay.com/api/?key=" + API_KEY)
  .then((response) => response.json())
  .then((body) => {
    // debugger;
    const imgList = body.hits
      .map((photo) => `<img src="${photo.webformatURL}" alt="${photo.tags}"/>`)
      .join(""); // Use join to convert array to string
    // debugger;
    document.getElementById("app").innerHTML = imgList;
  })
  .catch((error) => {
    debugger;
  });
