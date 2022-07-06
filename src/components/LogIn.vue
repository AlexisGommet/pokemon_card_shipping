<template>

    <div>

        <div v-if="!authLoading && !redirectAuthLoading" >

            <form @submit.prevent="handleSubmitLogin" class="signInContainer">

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

                    <div @click="emits('routeToReset')" class="forgotPassword">Mot de passe oublié</div>

                    <button type="submit" id="connect" class="submit connectBtn">Se connecter</button>
                    <div v-if="tooManyRequestsError" class="error">L'accès à ce compte a été temporairement désactivé en raison de nombreuses tentatives de connexion infructueuses. Veuillez réessayer plus tard.</div>
                </div>

                <a @click="emits('routeToSignUp')" class="submit" style="margin-top: 0px;">Créer un compte</a>

            </form>
            
        </div>

        <RingLoader v-if="authLoading || redirectAuthLoading" :color="'#505257'" :size="100" class="loader"/>

    </div>

</template>

<script setup>
import { useAuth } from '@vueuse/firebase/useAuth';
import { useRouter } from 'vue-router';
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { ref, onMounted, watch, defineEmits } from 'vue';
import RingLoader from './RingLoader';

const emits = defineEmits(['routeToSignUp', 'routeToReset', 'goBack']);

const router = useRouter();

const auth = getAuth();
const { isAuthenticated, user } = useAuth(auth);

const redirectAuthLoading = ref(false);
const authLoading = ref(false);
const alreadyExistErrorLogin = ref(false);
const emailLogin = ref('');
const passwordLogin = ref('');
const passwordErrorLogin = ref(false);
const userError = ref(false);
const tooManyRequestsError = ref(false);

onMounted(() => {
    if(localStorage.getItem("onSignIn") === "true"){
        localStorage.setItem("onSignIn", "false");
        redirectAuthLoading.value = true;
        setTimeout(() => {
            redirectAuthLoading.value = false;   
        }, 3000) ;
    } 
    if(isAuthenticated.value){
        localStorage.setItem("onSignIn", "false");
        router.push({name: 'addCard'});  
    }   
});

watch(isAuthenticated, (currentValue, oldValue) => {
    if(currentValue){
        localStorage.setItem("onSignIn", "false");
        router.push({name: 'addCard'});      
    }     
});

async function providerLogin(provider) {

    localStorage.setItem("onSignIn", "true");
    authLoading.value = true;
    
    try{
        await signInWithPopup(auth, provider);
    }catch(error){
        console.error(error);
        if(error.code === "auth/account-exists-with-different-credential"){         
            authLoading.value = false;
            alreadyExistErrorLogin.value = true;
        }
    }   
    
}

function login(type) {
    
    let provider;
    alreadyExistErrorLogin.value = false;  

    switch(type){
        case 'Google':
            provider = new GoogleAuthProvider();
            providerLogin(provider);
            break;
        case 'Twitter':
            provider = new TwitterAuthProvider();
            providerLogin(provider);
            break;
        case 'Facebook':
            provider = new FacebookAuthProvider();
            providerLogin(provider);
            break;
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

label {
    color: rgb(63, 63, 63);
    display:inline-block;
    margin: 25px 0 15px;
    text-transform: uppercase;
    font-family: 'Roboto';
    font-weight: bold;
}

h2{
    font-family: 'Roboto';
    font-weight: bold;
    margin: 15px auto;
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
    transform: translate(-50%, -50%);
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    z-index: 10;
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

.error {
    color: #ff0000;
    margin-top: 10px;
    font-size: 0.8em;
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

.forgotPassword{
    cursor: pointer;
    color: #1d439b;
    text-decoration: underline;
    margin-top: 15px;
}

.connectBtn{
    margin: 0 auto;
    margin-top: 25px;
    width: 100%;
    font-size: medium;
    font-family: 'Roboto';
    font-weight: bold;
    cursor: pointer;
}

.loader{
    display: flex;
    top: 300px;
    margin: 100px auto;
}

@media only screen and (max-width: 550px) {
    .signInContainer{
        gap: 10px;
        width: 300px;
    }
    label{
        margin: 0;
        margin-top: 10px;
    }
    .connectBtn{
        margin-top: 10px;
    }
    .forgotPassword{
        margin-top: 5px;
    }
    h2{
        margin: 5px auto;
    }
}

@media only screen and (max-width: 350px) {
    .signInContainer{
        width: 225px;
    }
}
</style>