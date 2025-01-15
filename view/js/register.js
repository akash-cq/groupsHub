const name = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const trm = document.querySelector("#termcond");
const submit = document.querySelector("#submit");
const msg = document.querySelector("#message");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
submit.addEventListener("click",()=>{
    name_Value = name.value.trim();
    email_Value = email.value.trim();
    password_Value = password.value.trim();
    trm_Value = trm.checked;
    if(name_Value === "" || email_Value === "" || password_Value === "" || !trm)
        {
            msgShow("please fill the form and accept Term & condition")
            return false;
        }
        const obj={
            name:name_Value,
            email:email_Value,
            password:password_Value,
        }
    fetch("/user/registartion",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json",
        },
        body:JSON.stringify(obj)
    })
    .then(data=>data.json())
    .then((data)=>{
        if(data.msg=="success")
                location="/user/login";
        else if(data.msg=="password"){
            msgShow("Password is too short");
        }else if(data.msg=="email")
                msgShow("either email is already exist or or wrong email")
        else if(data.msg=="username")
                msgShow("username already exist choose another");
        console.log(data.msg)
    })
    .catch(err=>console.log(err));
    return true;

})
function msgShow(msgVal){
    msg.textContent =`${msgVal}`;
    msg.style.color = "red";
    msg.style.display = "block";
    setTimeout(() => {
      msg.textContent = "";
      msg.style.display = "none";
    }, 3000);
    
}

login.addEventListener("click", async () => {
  try {
    location = "/user/login";
  } catch (err) {
    console.log(err);
  }
});
register.addEventListener("click", async () => {
  try {
    location = "/user/registartion";
  } catch (err) {
    console.log(err);
  }
});
const dashboard = document.querySelector(".dashboard")
dashboard.addEventListener("click", async () => {
  try {
    location = "/";
  } catch (err) {
    console.log(err);
  }
});