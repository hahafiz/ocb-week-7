// fetch("https://jsonplaceholder.typicode.com/todos/")
//   .then((response) => response.json()) // convert raw data to json format
//   .then((body) => {
//     const todoList = body.map((todo) => `<li> ${todo.title}</li>`);
//     return todoList;
//   })
//   .then((todoList) => {
//     // to display data to <div> id="app"></div>
//     document.getElementById("app").innerHTML = todoList;
//   })
//   .catch((err) => {
//     debugger;
//   });
fetch("https://jsonplaceholder.typicode.com/todos/")
  .then((response) => response.json())
  .then((body) => {
    const todoList = body.map((todo) => `<li> ${todo.title}</li>`);
    // debugger;
    return todoList;
  })
  .then((todoList) => {
    // to display data to <div> id="app"></div>
    document.getElementById("app").innerHTML = todoList;
  })
  .catch((err) => {
    debugger;
  });
