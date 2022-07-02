<template>

    <form @submit.prevent="handleSubmit" class="signUpForm">

        <img src="../assets/arrow-left-solid.svg" alt="arrow_left" class="arrow" @click="emits('goBack')"/>

        <h2>Création de compte</h2>

        <label>Email :</label>
        <input class="inputClass" type="email" v-model="email" required>

        <label>Mot de passe :</label>
        <input class="inputClass" type="password" v-model="password" required>            
        <div v-if="passwordError" class="error">Votre mot de passe doit être de 6 charactères ou plus</div>

        <button class="submit" type="submit">Créer un compte</button>  

    </form>       

</template>

<script setup>
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, onMounted, watch, defineEmits, defineProps } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['routeToSignUp', 'routeToReset', 'goBack']);

const router = useRouter();

const props = defineProps(['auth', 'isAuthenticated', 'user']);
const auth = ref(props.auth);
const isAuthenticated = ref(props.isAuthenticated);
const user = ref(props.user);

const email = ref('');
const password = ref('');
const passwordError = ref(false);

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


async function handleSubmit() {

    if(password.value.length < 6){
        passwordError.value = true;
        return;
    }

    try{
        await createUserWithEmailAndPassword(auth.value, email.value, password.value);
        email.value = "";
        password.value = "";
        passwordError.value = false;
        await sendEmailVerification(user.value.auth.currentUser);
    }catch(error){
        console.error(error);
    }     
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

.error {
    color: #ff0000;
    margin-top: 10px;
    font-size: 0.8em;
    font-family: 'Roboto';
    font-weight: bold;
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

.inputClass {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid rgb(136, 136, 136);
    background: rgb(243, 243, 243);
}

.arrow {
    width: 25px;
    height: 25px;
    cursor: pointer;
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

h2{
    font-family: 'Roboto';
    font-weight: bold;
    margin: 15px auto;
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
</style>