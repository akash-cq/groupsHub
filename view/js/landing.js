const login = document.querySelector(".login");
const register = document.querySelector(".register");
login.addEventListener("click",async ()=>{
    try{
            location="/user/login";

    }
    catch(err){
        console.log(err);
    }
})
register.addEventListener("click", async () => {
  try {
    location = "/user/registartion";
  } catch (err) {
    console.log(err);
  }
});
const dashboard = document.querySelector(".dashboard");
dashboard.addEventListener("click", async () => {
  try {
    location = "/";
  } catch (err) {
    console.log(err);
  }
});