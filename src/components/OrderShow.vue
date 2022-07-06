<template>

    <div>

        <div v-if="isAuthenticated">

            <ModalShow v-if="showModal" :text="modalText" :color="modalColor" style="top: 0px;"/>

            <form @submit.prevent="checkout">

                <img src="../assets/arrow-left-solid.svg" alt="arrow_left" class="arrow" @click="emits('goBack')"/>

                <h2>Entrez les informations de livraison</h2>

                <div>
                    <label for='name'>Prénom</label>
                    <input type="text" name="name">
                </div>
                <div>
                    <label for='lastname'>Nom</label>
                    <input type="text" name="lastname">
                </div>
                <div>
                    <label for='mail'>Email</label>
                    <input type="text" name="mail">
                </div>
                <div>
                    <label for='address1'>Ligne d'adresse 1</label>
                    <input type="text" name="address1">
                </div>
                <div>
                    <label for='address2'>Ligne d'adresse 2</label>
                    <input type="text" name="address2">
                </div>
                <div>
                    <label for='city'>Ville</label>
                    <input type="text" name="city">
                </div>
                <div>
                    <label for='postalcode'>Code Postal</label>
                    <input type="number" name="postalcode">
                </div>    
            
                <button type="submit">{{ btnContent }}<RingLoader v-if="checkoutLoad" :color="'#505257'" :size="30"/></button>

                <div v-if="fieldError" class="error">Veuillez remplir tous les champs obligatoires</div>
            
            </form>

        </div>

        <LogIn v-else/>

    </div>

</template>

<script setup>
import { useAuth } from '@vueuse/firebase/useAuth';
import { getFirestore, collection, orderBy, query, where, getDocs }  from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, onMounted, defineEmits } from 'vue';
import RingLoader from './RingLoader';
import LogIn from './LogIn.vue';
import ModalShow from './ModalShow.vue';

const emits = defineEmits(['routeToSignUp', 'routeToReset', 'goBack']);

const firestore = getFirestore();

const auth = getAuth();
const { isAuthenticated, user } = useAuth(auth);

const docs = ref();
const fieldError = ref(false);
const checkoutLoad = ref(false);
const btnContent = ref("Payer");
const showModal = ref(false);
const modalText = ref("");
const modalColor = ref("");

onMounted( () => {
    getItems();
});

function slideModal(text, color){
    modalText.value = text;
    modalColor.value = color;
    showModal.value = true;
    setTimeout(() => {
        showModal.value = false;
    }, 6000);
}

async function getItems(){

    const getquery = query(collection(firestore, "Cards"), where("user", "==", user.value.uid), where("status", "==", "pending"), orderBy("createdAt"));

    let list = [];
    
    await getDocs(getquery).then((documents) => {
        documents.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            list.push(data);
        });
        docs.value = list;
    });
}

async function checkout(e){

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if(!formProps.name || !formProps.lastname || !formProps.mail || !formProps.address1 || !formProps.city || !formProps.postalcode){
        fieldError.value = true;
        return;
    }

    fieldError.value = false;

    checkoutLoad.value = true;
    btnContent.value = "";

    let idList = [];

    docs.value.forEach((item) => {
        idList.push(item.id);
    });

    const body = {
        "quantity": ""+docs.value.length+"",
        "idList": ""+idList+"",
        "orderInfo": ""+JSON.stringify(formProps)+"",
        "email": ""+formProps.mail+""
    };

    try{

        const response = await fetch('https://us-central1-pokemoncardshipping.cloudfunctions.net/checkout', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'},
        });
        
        const redirect = await response.json();
        window.location.href = redirect.url;

    }catch(error){
        console.error(error);
        slideModal("Une erreur est survenue", "red");
    }finally{
        checkoutLoad.value = false;
        btnContent.value = "Payer";
    }  
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

.arrow {
    width: 25px;
    height: 25px;
    cursor: pointer;
}


form{
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 500px;
    gap: 18px;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 50px;
    transform: translate(-50%, -50%);
    background: rgb(243, 243, 243);
    padding: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
    font-family: 'Roboto';
    font-weight: bold;
}

form button{
    text-align: center;
    background: radial-gradient(circle, rgb(7, 7, 7), rgb(36, 36, 36), rgb(44, 44, 44));
    border: 0;
    margin-top: 10px;
    padding: 10px 20px;
    color: white;
    border-radius: 20px;
    font-family: 'Roboto';
    font-weight: bold;
    cursor: pointer; 
}

form div{
    display: flex;
    width: 95%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}

.error {
    position: relative;
    color: #ff0000;
    right: -50px;
    font-size: 0.8em;
    font-family: 'Roboto';
    font-weight: bold;
}

@media only screen and (max-width: 400px) {
    form {
        padding: 5px;
        width: 315px;
    }
    form div{
        width: 100%;
    }
    .error {
        top: -12px;
        right: -30px;
    }
}

@media only screen and (max-width: 350px) {
    form div{
        width: 190px;
        margin-left: 15px;
    }
    form {
        padding: 10px;
        margin-top: 25px;
        height: 550px;
        width: 225px;
        gap: 10px;
    }
    label{
        margin-bottom: 3px;
    }
    h2{
        margin: 5px;
        font-size: large;
    }
    .error {
        top: -5px;
        right: -10px;
    }
}

:root {
  color-scheme: only light;
}
</style>