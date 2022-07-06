<template>

    <div>
        
        <div v-if="isAuthenticated">

            <form @submit.prevent="sendCard">

                <h2>Ajouter une carte</h2>

                <div>
                    <label for='name'>Nom de la carte* </label>
                    <input type="text" name="name">
                </div>
                <div>
                    <label for='number'>Numéro* </label>
                    <input type="number" name="number">
                </div>
                <div>
                    <label for='series'>Série* </label>
                    <input type="text" name="series">
                </div>
                <div>
                    <label for='language'>Langue* </label>
                    <input type="text" name="language">
                </div>
                <div>
                    <label for='service'>Service Value </label>
                    <input type="checkbox" name="service">
                </div>
                <div>
                    <label for='value'>Valeur déclarée* </label>
                    <input type="number" name="value">
                </div>
                <div>
                    <label for='comment'>Commentaire </label>
                    <input type="text" name="comment">
                </div>

                <button type="submit">+ Ajouter une carte au panier</button> 

                <div v-if="fieldError" class="error">Veuillez remplir toutes les informations obligatoires</div>

            </form>

            <ModalShow v-if="showModal" :text="modalText" :color="modalColor" />

        </div>

        <LogIn v-else/>

    </div>

</template>

<script setup>
import { useAuth } from '@vueuse/firebase/useAuth';
import { getFirestore, collection, addDoc, serverTimestamp }  from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import ModalShow from './ModalShow.vue';
import LogIn from './LogIn.vue';

const auth = getAuth();
const { isAuthenticated, user } = useAuth(auth);

const firestore = getFirestore();

const fieldError = ref(false);
const showModal = ref(false);
const modalText = ref("");
const modalColor = ref("");

async function sendCard(e) {

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if(!formProps.name || !formProps.number || !formProps.series || !formProps.language || !formProps.value){
        fieldError.value = true;
        return;
    }

    fieldError.value = false;

    try{
        await addDoc(collection(firestore, "Cards"), {

            name:       formProps.name,
            number:     formProps.number,
            series:     formProps.series,
            language:   formProps.language,
            service:    formProps.service ? true : false,
            value:      formProps.value,
            comment:    formProps.comment,
            user:       user.value.uid,
            status:     "pending",
            createdAt:  serverTimestamp(firestore),

        });
        slideModal("Carte ajoutée avec succès", "green");
    }catch(error){
        console.error(error);
        slideModal("Une erreur est survenue", "red");
    }
}

function slideModal(text, color){
    modalText.value = text;
    modalColor.value = color;
    showModal.value = true;
    setTimeout(() => {
        showModal.value = false;
    }, 6000);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

.loader{
    display: flex;
    top: 300px;
    margin: 100px auto;
}

form{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
    height: 450px;
    gap: 20px;
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
    margin-top: 20px;
    padding: 10px 20px;
    color: white;
    border-radius: 20px;
    font-family: 'Roboto';
    font-weight: bold;
    cursor: pointer;  
}

form div{
    display: flex;
    width: 90%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}

form input[type=checkbox]{
    position: relative;
    left: -51%;
}

.error {
    position: relative;
    color: #ff0000;
    right: -15px;
    font-size: 0.8em;
    font-family: 'Roboto';
    font-weight: bold;
}

.success {
    position: relative;
    color: #088f00;
    right: -100px;
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
    form input[type=checkbox]{
        left: -51.5%;
    }
}

@media only screen and (max-width: 350px) {
    form div{
        width: 190px;
        margin-left: 15px;
    }
    form {
        margin-top: 25px;
        height: 550px;
        width: 225px;
    }
    form input[type=checkbox]{
        left: -25%;
    }
    label{
        margin-bottom: 3px;
    }
    h2{
        margin: 5px;
    }
}

:root {
  color-scheme: only light;
}

</style>