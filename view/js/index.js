let btnCreate = document.querySelector(".create");
let btnJoin = document.querySelector(".join");
let username = document.querySelector(".username");
let email = document.querySelector(".email-info");
let group_list = document.querySelector("tbody");
let select = document.querySelector("select");
let logo = document.querySelector(".logo")
let groupArr = [];
let userId;
btnCreate.addEventListener("click", () => {
  window.location = "/user/CreategroupPage";
});
btnJoin.addEventListener("click", () => {
  window.location = "/user/joingroup";
});
window.onload = async () => {
  try {
    let count = 1;
    let data = await fetch("/user/details");
    let user = await data.json();
    console.log(user);
    username.innerHTML = user.username;
    email.innerHTML = user.email;
    userId = user.id;
    user.groups.forEach((element) => {
      createList(element, count);
      groupArr.push(element);
      count++;
    });
  } catch (error) {
    console.log(error);
  }
};
function createList(groupinfo, count){
  console.log(group_list)
  let div = document.createElement("tr");
  let list = `
            <td class="sr-no">${count}.</td>
            <td  class="group"><a href="/chats/${groupinfo.groupId}/${userId}">${groupinfo.name}</a></td>
            <td class="group-members">${groupinfo.members}</td>
            <td class="message">${groupinfo.description}</td>
  `;
  div.innerHTML = list;
  group_list.append(div);
}
select.addEventListener("change", () => {
  let sortedGroups;
  if ((select.value == "Most-Active")) {
        sortedGroups = [...groupArr].sort(
          (a, b) =>
            new Date(b.last_active_group) - new Date(a.last_active_group)
        );

  } else if (select.value == "Recently-joined") {
    sortedGroups = [...groupArr].sort(
      (a, b) => new Date(b.joined_at) - new Date(a.joined_at)
    );
    
  } else if (select.value == "Alphabatical") {
              sortedGroups = [...groupArr].sort((a, b) =>
                a.name-b.name
              );

  } else {
    sortedGroups = groupArr;
  }
  console.log(sortedGroups)
  let count=1;
  group_list.innerHTML="";
  sortedGroups.forEach(element=>{
    console.log(element)
    createList(element,count);
    count++;
  })
});
