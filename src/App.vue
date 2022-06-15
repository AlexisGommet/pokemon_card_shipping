<template>
    <button v-if="!isAuthenticated" @click="login" class="signIn">
        Sign In with Google
    </button>
    <div v-else>
        <nav>
            <div>
                <router-link to="/addCard">Ajouter des cartes</router-link>
            </div>
            <div>
                <router-link to="/basketShow">Panier</router-link>
            </div>
            <!-- <div>
                <router-link to="">Un autre lien</router-link>
            </div> -->
            <div>{{ user.displayName }}</div>
            <button id='sign_out' @click="auth.signOut()" class="signOut">Sign Out</button>
        </nav>
        <router-view :auth="user"></router-view>
    </div>
</template>

<script setup>

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { useAuth } from '@vueuse/firebase/useAuth';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import * as firebase from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
    apiKey: "AIzaSyCbbnyo_TcGYcyze_gZldDtm1eD7XeesSM",
    authDomain: "pokemoncardshipping.firebaseapp.com",
    projectId: "pokemoncardshipping",
    storageBucket: "pokemoncardshipping.appspot.com",
    messagingSenderId: "692726147102",
    appId: "1:692726147102:web:d5d5f865497b2611e1260f",
    measurementId: "G-D41S3B2C60"
})

const analytics = getAnalytics(app);

const auth = getAuth();

const { isAuthenticated, user } = useAuth(auth);

const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
}

</script>

<style scoped>
nav{
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5%;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: rgb(108, 108, 108);
  
}

a:-webkit-any-link {
    color: white;
}
.signIn{
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
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
    height: 48px;
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
</style>
