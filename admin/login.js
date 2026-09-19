import {auth} from "./firebase.js";
import {signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
const form=document.getElementById("loginForm"),err=document.getElementById("error");
onAuthStateChanged(auth,u=>{if(u)location.href="admin.html"});
form.onsubmit=async e=>{e.preventDefault();err.textContent="";try{await signInWithEmailAndPassword(auth,email.value,password.value);location.href="admin.html"}catch(x){err.textContent="Login failed. Check email/password and Firebase Authentication setup."}};
