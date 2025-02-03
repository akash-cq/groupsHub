const select = document.querySelector("select");
const main = document.querySelector("main");
let logo = document.querySelector(".logo");
let btnCreate = document.querySelector(".create");
let btnJoin = document.querySelector(".join");
let logout = document.querySelector(".logout");
logout.addEventListener("click", async () => {
  sessionStorage.removeItem("token");
  try {
    let data = await fetch("/user/logout");
    let res = await data.json();
    window.location = "/";
    console.log(res);
  } catch (error) {
    alert("Something went wrong");
  }
});
select.addEventListener("change", async () => {
  const val = select.value;

  await ApiCall(val);
});
window.onload = ApiCall("All");
async function ApiCall(type) {
  try {
    let response = await fetch("/user/joingroup/listgroups/" + type);
    console.log(response);
    if (!response.ok) throw new Error("error");
    let data = await response.json();
    main.innerHTML = "";
    data.forEach((element) => {
      createCards(element);
    });
  } catch (err) {
    console.log(err);
  }
}
function createCards(obj) {
  let type = obj.grouptype == "private" ? "Request" : "join now";
  if (obj.join || obj.adminIs) {
    type = "Joined Already";
  } else if (obj.isRqst) {
    type = "Request Send..";
  }
  let cards = document.createElement("div");
  cards.className = "card";
  cards.innerHTML = `
    <div class="img">
    </div>
  <div class="card-body">
    <h5 class="card-title">${obj.groupname}</h5>
    <p class="card-text">${obj.description}</p>
    <h6>${obj.grouptype + " Group"}</h6>
    <p>${obj.members} members</p>
    <button href="#" class="btn btn-primary">${type}</button>
  </div>`;
  main.append(cards);
  cards.querySelector("button").addEventListener("click", async (event) => {
    if (
      obj.grouptype == "public" &&
      event.target.innerHTML != "Joined Already"
    ) {
      try {
        console.log(obj.groupname);
        let response = await fetch("/user/joingroup/join", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ groupname: obj.groupname }),
        });
        console.log(response);
        if (!response.ok) throw new Error("error");
        let data = await response.json();
        alert(data);
        console.log(data.msg);
        if (data.msg == "you have joined the group")
          event.target.innerHTML = "joined";
      } catch (err) {
        console.log(err);
      }
    } else if (
      obj.grouptype == "private" &&
      event.target.innerHTML == "Request"
    ) {
      try {
        console.log(obj.groupname);
        let response = await fetch("/user/joingroup/join/rqst", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ groupname: obj.groupname }),
        });
        console.log(response);
        if (!response.ok) throw new Error("error");
        let data = await response.json();
        alert(data);
        console.log(data.msg);
        if (data.msg == "wait") event.target.innerHTML = "Request send.";
      } catch (err) {
        console.log(err);
      }
    }
    console.log(obj);
  });
  console.log(obj);
}
logo.addEventListener("click", () => {
  window.location = "/home";
});
btnCreate.addEventListener("click", () => {
  window.location = "/user/CreategroupPage";
});
btnJoin.addEventListener("click", () => {
  window.location = "/user/joingroup";
});
