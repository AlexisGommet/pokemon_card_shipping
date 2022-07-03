<template>

    <div class="container">
        
        <div v-if="isAuthenticated">

            <nav>
                <div class="row row-placement1">              
                    <router-link to="/addCard">Ajouter des cartes</router-link>
              
                    <router-link to="/basket">Panier</router-link>
                </div>

                <div class="row row-placement2">
                    <div id="helloUser" v-if="user.displayName" >Bonjour, {{ user.displayName }}</div>
                    <button id='sign_out' @click="signOut()" class="signOut">Sign Out</button>
                </div>
            </nav>
            
        </div>

        <router-view v-if="!firstLoad" @goBack="goBack()" @routeToSignUp="routeTo('signUp')" @routeToReset="routeTo('passwordReset')"></router-view> 

        <div v-if="router.currentRoute.value.fullPath === '/' && !firstLoad">
            <h1>PokePostie</h1>
            <p>Une carte à grader ?</p><br><br><br><br>
            <p class="p2">Il suffit de nous l'envoyer, et on s'occupe du reste !</p>
            <img src="./assets/graphic-removebg.png" alt="graphic" class="image" />
            <button class="login" @click="routeTo('login')">Login</button>
        </div>

    </div>

    <RingLoader v-if="firstLoad" :color="'#505257'" :size="100" class="loader"/>

</template>

<script setup>
import { useAuth } from '@vueuse/firebase/useAuth';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { onMounted, watch, ref, defineEmits } from 'vue';
import RingLoader from './components/RingLoader';

const emits = defineEmits(['routeToSignUp', 'routeToReset', 'goBack']);

const router = useRouter();

const auth = getAuth();
const { isAuthenticated, user } = useAuth(auth);

const firstLoad = ref(false);

onMounted(() => {
    if(isAuthenticated.value && router.currentRoute.value.fullPath !== '/checkoutSuccess' && router.currentRoute.value.fullPath !== '/checkoutFailure'){
        localStorage.setItem("onSignIn", "false");
        router.push({name: 'addCard'});  
    }
    firstLoad.value = true;
    setTimeout(() => {
        firstLoad.value = false;   
    }, 2000);   
});

watch(isAuthenticated, (currentValue, oldValue) => {
    if(currentValue && router.currentRoute.value.fullPath !== '/checkoutSuccess' && router.currentRoute.value.fullPath !== '/checkoutFailure'){
        localStorage.setItem("onSignIn", "false");
        router.push({name: 'addCard'});      
    }     
});

function signOut() { 
    auth.signOut();
    router.push({name: 'login'});    
}

function routeTo(route){
    router.push({name: route});    
}

function goBack(){
    router.go(-1);    
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

h1{
    position: absolute;
    text-align: center;
    left: 50%;
    font-family: 'Roboto';
    font-weight: bold;
    font-size: xx-large;
    transform: translate(-50%, 100%) scale(2);
}

p{
    position: absolute;
    left: 50%;
    width: 750px;
    text-align: center;
    font-family: 'Roboto';
    font-weight: bold;
    font-size: xx-large;
    transform: translate(-50%, 400%);
}

.image{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.5);
}

.loader{
    display: flex;
    top: 300px;
    margin: 100px auto;
}

.row{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 25px;
}

.row-placement1{
    margin-left: 100px;
    margin-right: 25px;
}

.row-placement2{
    margin-right: 100px;
    margin-left: 25px;
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
    z-index: 10;
}

a:-webkit-any-link {
    color: white;
    color: #161616;
    text-decoration: none;
}

.container{
    position: fixed;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom right, rgb(118, 118, 118), rgb(66, 66, 65));
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}
.container::-webkit-scrollbar {
  width: 0.5rem;
}

.container::-webkit-scrollbar-track {
  background: #292929;
}

.container::-webkit-scrollbar-thumb {
  background: #717075;
  border-radius: 2em;
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

.login {
    position: absolute;
    text-align: center;
    width: 200px;
    height: 50px;
    background: radial-gradient(circle, rgb(7, 7, 7), rgb(36, 36, 36), rgb(44, 44, 44));
    border: 0;
    padding: 10px 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 600%);
    color: white;
    border-radius: 20px;
    font-family: 'Roboto';
    font-weight: bold;
    font-size: x-large;
    cursor: pointer;
}

@media only screen and (max-width: 700px) {
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
    .row-placement1{
        margin-left: 25px;
        margin-right: 25px;
    }

    .row-placement2{
        margin-right: 25px;
        margin-left: 25px;
    }
}

@media only screen and (max-width: 550px) {
    #helloUser{
        display: none;
    }
    .row{
        gap: 10px;
    }
    .row-placement1{
        margin-left: 10px;
        margin-right: 15px;
    }

    .row-placement2{
        margin-right: 10px;
        margin-left: 15px;
    }

    h1{
        font-size: xx-large;
        transform: translate(-50%, 100%) scale(2);
    }

    p{
        width: 750px;
        font-size: xx-large;
        transform: translate(-50%, 400%);
    }

    .image{
        position: absolute;
        transform: translate(-50%, -50%) scale(1.5);
    }
}

@media only screen and (max-height: 850px) {

    h1{
        font-size: x-large;
    }

    p{
        font-size: x-large;
    }

    .image{
        transform: translate(-50%, -50%) scale(1);
    }

    .login {
        transform: translate(-50%, 400%);
    }
}

@media only screen and (max-height: 675px) {

    h1{
        font-size: x-large;
    }

    p{
        font-size: x-large;
    }

    .image{
        transform: translate(-50%, -50%) scale(0.75);
    }

    .login {
        transform: translate(-50%, 350%);
    }
}

@media only screen and (max-width: 500px) {

    h1{
        font-size: large;
    }

    p{
        font-size: large;
        width: 275px;
    }

    .p2{
        transform: translate(-50%, 200%);
    }

    .image{
        transform: translate(-50%, -50%) scale(0.5);
    }

    .login {
        transform: translate(-50%, 350%);
    }
}
</style>
