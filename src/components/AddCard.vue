<template>
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
        <div v-if="submitSuccess" class="success">Ajouter avec succès</div>
        <div v-if="submitError" class="error">Erreur lors de l'ajout au panier</div>

    </form>
</template>

<script setup>

import { getFirestore, collection, addDoc, serverTimestamp }  from 'firebase/firestore';
import { defineProps, ref } from 'vue';

const firestore = getFirestore();

const fieldError = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);

const auth = defineProps(['auth']);

async function sendCard(e) {

    submitSuccess.value = false;
    submitError.value = false;

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    if(!formProps.name || !formProps.number || !formProps.series || !formProps.language || !formProps.value){
        fieldError.value = true;
        return;
    }

    fieldError.value = false;

    await addDoc(collection(firestore, "Cards"), {

        name:       formProps.name,
        number:     formProps.number,
        series:     formProps.series,
        language:   formProps.language,
        service:    formProps.service ? true : false,
        value:      formProps.value,
        comment:    formProps.comment,
        user:       auth.auth.uid,
        status:     "pending",
        createdAt:  serverTimestamp(firestore),

    }).then(() => {
        submitSuccess.value = true;
    }).catch((error) => {
        console.error(error);
        submitError.value = true;
    });  
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

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
    transform: translate(-50%, -50%);
    background: rgb(243, 243, 243);
    gap: 20px;
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
    width: 90%;
    flex-direction: row;
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

</style>