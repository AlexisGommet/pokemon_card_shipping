<template>

    <div>

        <form @submit.prevent="handleSubmitReset" class="signUpForm">

            <img src="../assets/arrow-left-solid.svg" alt="arrow_left" class="arrow" @click="mailSuccess = false;emits('goBack');"/>

            <h2>Réinitialisation de mot de passe</h2>

            <label>Email :</label>
            <input class="inputClass" type="email" v-model="emailReset" required>
            <div v-if="userErrorReset" class="error">Cet utilisateur n'existe pas</div>
            <div v-if="mailSuccess" class="success">Mail envoyé avec succès</div>

            <button class="submit" type="submit">Envoyer le mail de réinitialisation</button>  

        </form>  

    </div>

</template>

<script setup>
import { useAuth } from '@vueuse/firebase/useAuth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { ref, onMounted, watch, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['routeToSignUp', 'routeToReset', 'goBack']);

const router = useRouter();

const auth = getAuth();
const { isAuthenticated, user } = useAuth(auth);

const emailReset = ref('');
const userErrorReset = ref(false);
const mailSuccess = ref(false);

onMounted(() => {
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

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

.inputClass {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid rgb(136, 136, 136);
    background: rgb(243, 243, 243);
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

@media only screen and (max-width: 550px) {
    .signUpForm{
        gap: 10px;
        width: 300px;
    }
}

@media only screen and (max-width: 350px) {
    .signUpForm{
        width: 225px;
    }
}

:root {
  color-scheme: only light;
}
</style>