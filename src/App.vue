<template>

    <div class="container">
        <div v-if="!isAuthenticated && !authLoading && !redirectAuthLoading && !showSignUp && !reset" class="signInContainer">

            <h2>Connectez-vous avec</h2>

            <input type="image" alt="google_button" src="./assets/btn_google_signin_dark_normal_web@2x.png" @click="login('Google')" class="signIn" />
            <input type="image" alt="twitter_button" src="./assets/twitter-login.png" @click="login('Twitter')" class="signIn" />
            <input type="image" alt="facebook_button" src="./assets/facebook_login.png" @click="login('Facebook')" class="signIn" />
            
            <div class="lineContainer">
                <div class="line"></div>
                <h3>Ou</h3>
                <div class="line"></div>
            </div>

            <div v-if="alreadyExistErrorLogin" class="error">Ce mail est déjà utilisée pour un autre compte</div>

            <div>
                <label>Email :</label>
                <input class="inputClass" type="email" v-model="emailLogin" required>
                <div v-if="userError" class="error">Cet utilisateur n'existe pas</div>

                <label>Mot de passe :</label>
                <input class="inputClass" type="password" v-model="passwordLogin" required>
                <div v-if="passwordErrorLogin" class="error">Mot de passe incorret</div>

                <div @click="reset = true" class="forgotPassword">Mot de passe oublié</div>

                <div class="submit" @click="handleSubmitLogin" style="margin-top: 25px;">Se connecter</div>
                <div v-if="tooManyRequestsError" class="error">L'accès à ce compte a été temporairement désactivé en raison de nombreuses tentatives de connexion infructueuses. Veuillez réessayer plus tard.</div>
            </div>

            <a @click="showSignUp = true" class="submit" style="margin-top: 0px;">Créer un compte</a>
         
        </div>

        <RingLoader v-if="authLoading || redirectAuthLoading" :color="'#505257'" :size="100" class="loader"/>

        <div v-if="isAuthenticated">
            <nav>
                <div class="row" style="margin-left: 100px;margin-right: 25px;">
                    <router-link to="/">Acceuil</router-link>
                
                    <router-link to="/addCard">Ajouter des cartes</router-link>
              
                    <router-link to="/basketShow">Panier</router-link>
                </div>

                <div class="row" style="margin-right: 100px;margin-left: 25px;">
                    <div v-if="user.displayName" >Bonjour, {{ user.displayName }}</div>
                    <button id='sign_out' @click="signOut" class="signOut">Sign Out</button>
                </div>
            </nav>
            
        </div>

        <router-view :auth="user"></router-view>

        <div v-if="showSignUp">
            <form @submit.prevent="handleSubmit" class="signUpForm">

                <img src="./assets/arrow-left-solid.svg" alt="arrow_left" class="arrow" @click="showSignUp = false"/>

                <h2>Création de compte</h2>

                <label>Email :</label>
                <input class="inputClass" type="email" v-model="email" required>

                <label>Mot de passe :</label>
                <input class="inputClass" type="password" v-model="password" required>            
                <div v-if="passwordError" class="error">Votre mot de passe doit être de 6 charactères ou plus</div>
        
                <button class="submit" type="submit">Créer un compte</button>  

            </form>       
        </div> 

        <div v-if="reset">
            <form @submit.prevent="handleSubmitReset" class="signUpForm">

                <img src="./assets/arrow-left-solid.svg" alt="arrow_left" class="arrow" @click="reset = false;mailSuccess = false;"/>

                <h2>Réinitialisation de mot de passe</h2>

                <label>Email :</label>
                <input class="inputClass" type="email" v-model="emailReset" required>
                <div v-if="userErrorReset" class="error">Cet utilisateur n'existe pas</div>
                <div v-if="mailSuccess" class="success">Mail envoyé avec succès</div>

                <button class="submit" type="submit">Envoyer le mail de réinitialisation</button>  

            </form>       
        </div>

    </div>

</template>

<script setup>

import { getAnalytics } from "firebase/analytics";
import { useAuth } from '@vueuse/firebase/useAuth';
import { useRouter } from 'vue-router';
import { getAuth, GoogleAuthProvider, signInWithRedirect, TwitterAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithPopup } from 'firebase/auth';
import { ref, onMounted, watch } from 'vue';
import * as firebase from 'firebase/app';
import RingLoader from './components/RingLoader';

const app = firebase.initializeApp({
    apiKey: "AIzaSyCbbnyo_TcGYcyze_gZldDtm1eD7XeesSM",
    authDomain: "pokemoncardshipping.firebaseapp.com",
    projectId: "pokemoncardshipping",
    storageBucket: "pokemoncardshipping.appspot.com",
    messagingSenderId: "692726147102",
    appId: "1:692726147102:web:d5d5f865497b2611e1260f",
    measurementId: "G-D41S3B2C60"
})

const router = useRouter();

const showSignUp = ref(false);
const authLoading = ref(false);
const redirectAuthLoading = ref(false);
const email = ref('');
const password = ref('');
const emailLogin = ref('');
const passwordLogin = ref('');
const passwordError = ref(false);
const passwordErrorLogin = ref(false);
const alreadyExistErrorLogin = ref(false);
const userError = ref(false);
const tooManyRequestsError = ref(false);
const reset = ref(false);
const emailReset = ref('');
const userErrorReset = ref(false);
const mailSuccess = ref(false);

const analytics = getAnalytics(app);

const auth = getAuth();

const { isAuthenticated, user } = useAuth(auth);

onMounted(() => {
    if(localStorage.getItem("onSignIn") === "true"){
        redirectAuthLoading.value = true;        
    }
    setTimeout(() => {
        redirectAuthLoading.value = false;
    }, 8000);
});

watch(isAuthenticated, (currentValue, oldValue) => {
    if(currentValue){
        redirectAuthLoading.value = !isAuthenticated;
        localStorage.setItem("onSignIn", "false");    
    }     
});

async function handleSubmitReset() {

    try{
        await sendPasswordResetEmail(auth, emailReset.value);
        emailReset.value = "";
        userErrorReset.value = false;
        mailSuccess.value = true;
    }catch(error){
        console.error(error);
        if(error.code === "auth/user-not-found"){         
            userErrorReset.value = true;
        }
    }
}

async function providerLogin(provider, type) {
    localStorage.setItem("onSignIn", "true");
    authLoading.value = true;
    try{
        type === "F" ? await signInWithPopup(auth, provider): await signInWithRedirect(auth, provider);
    }catch(error){
        console.error(error);
        if(error.code === "auth/account-exists-with-different-credential"){         
            signOut();
            authLoading.value = false;
            alreadyExistErrorLogin.value = true;
        }
    }   
    
}

function signOut() { 
    auth.signOut();
    router.push({name: '/'});    
}

function login(type) {

    let provider;
    alreadyExistErrorLogin.value = false;  

    switch(type){
        case 'Google':
            provider = new GoogleAuthProvider();
            providerLogin(provider, "G");
            break;
        case 'Twitter':
            provider = new TwitterAuthProvider();
            providerLogin(provider, "T");
            break;
        case 'Facebook':
            provider = new FacebookAuthProvider();
            providerLogin(provider, "F");
            break;
    }
}

async function handleSubmit() {

    if(password.value.length < 6){
        passwordError.value = true;
        return;
    }

    try{
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        email.value = "";
        password.value = "";
        passwordError.value = false;
        showSignUp.value = false;
        await sendEmailVerification(user.value.auth.currentUser);
    }catch(error){
        console.error(error);
    }     
}

async function handleSubmitLogin() {

    try{
        await signInWithEmailAndPassword(auth, emailLogin.value, passwordLogin.value);
        emailLogin.value = "";
        passwordLogin.value = "";
        passwordErrorLogin.value = false;
        userError.value = false;
        tooManyRequestsError.value = false;
        alreadyExistErrorLogin.value = false;   
    }catch(error){
        console.error(error);
        if(error.code === "auth/user-not-found"){         
            userError.value = true;
            passwordErrorLogin.value = false;
            tooManyRequestsError.value = false;  
        }else if(error.code === "auth/wrong-password"){
            userError.value = false;
            passwordErrorLogin.value = true;
            tooManyRequestsError.value = false; 
        }else if(error.code === "auth/too-many-requests"){
            tooManyRequestsError.value = true;  
            passwordErrorLogin.value = false;
            userError.value = false;
        }
    }     
}


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

.row{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 25px;
}

nav{
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    color: #161616;
    background: rgb(129, 129, 129);
    font-family: 'Roboto';
}

a:-webkit-any-link {
    color: white;
    color: #161616;
    text-decoration: none;
}
.loader{
    display: flex;
    top: 300px;
    margin: 100px auto;
}
.signInContainer{
    display: flex;
    flex-direction: column;
    background: rgb(243, 243, 243);
    gap: 25px;
    width: auto;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
}
.container{
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom right, rgb(118, 118, 118), rgb(66, 66, 65));
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
.container::-webkit-scrollbar {
  width: 0.5rem;
}

.container::-webkit-scrollbar-track {
  background: #292929;
}

.container::-webkit-scrollbar-thumb {
  background: #717075;
  border-radius:2em;
}
.signIn{  
    height: 50px;
    width: 225px;
    margin: 0 auto;
}
.signIn:hover {
  background: #F6F9FE;
  color: #174ea6;
}

.signIn:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.signIn:focus {
  outline: none;
  border: 2px solid #4285f4;
}
.signOut{
    align-items: center;
    appearance: none;
    background-color: #fff;
    border-radius: 24px;
    border-style: none;
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
    box-sizing: border-box;
    color: #3c4043;
    cursor: pointer;
    display: inline-flex;
    fill: currentcolor;
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 30px;
    justify-content: center;
    letter-spacing: .25px;
    line-height: normal;
    max-width: 100%;
    overflow: visible;
    padding: 2px 24px;
    text-align: center;
    text-transform: none;
    transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1),opacity 15ms linear 30ms,transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: auto;
    will-change: transform,opacity;
    z-index: 0;
}
.signOut:hover {
  background: #F6F9FE;
  color: #174ea6;
}

.signOut:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.signOut:focus {
  outline: none;
  border: 2px solid #4285f4;
}

.signUpForm {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    margin: 30px auto;
    background: rgb(243, 243, 243);
    text-align: left;
    padding: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
}

label {
    color: rgb(63, 63, 63);
    display:inline-block;
    margin: 25px 0 15px;
    text-transform: uppercase;
    font-family: 'Roboto';
    font-weight: bold;
}

.inputClass {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid rgb(136, 136, 136);
    background: rgb(243, 243, 243);
}

.submit {
    text-align: center;
    background: radial-gradient(circle, rgb(7, 7, 7), rgb(36, 36, 36), rgb(44, 44, 44));
    border: 0;
    margin-top: 40px;
    padding: 10px 20px;
    color: white;
    border-radius: 20px;
    font-family: 'Roboto';
    font-weight: bold;
    cursor: pointer;
}

h2{
    font-family: 'Roboto';
    font-weight: bold;
    margin: 15px auto;
}

.error {
    color: #ff0000;
    margin-top: 10px;
    font-size: 0.8em;
    font-family: 'Roboto';
    font-weight: bold;
}

.success {
    color: #088f00;
    margin-top: 10px;
    font-size: 0.8em;
    font-family: 'Roboto';
    font-weight: bold;
}

.arrow {
    width: 25px;
    height: 25px;
    cursor: pointer;
}

.line {
  background-color: #d2d1d1;
  border: #d2d1d1 1px solid;
  width: 42%;
  height: 1px;
  margin-left: 10px;
  margin-right: 10px;
}

.lineContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
}

h3{
    font-family: 'Roboto';
    font-weight: bold;
    margin: 0;  
}

.forgotPassword{
    cursor: pointer;
    color: #1d439b;
    text-decoration: underline;
    margin-top: 15px;
}
</style>
