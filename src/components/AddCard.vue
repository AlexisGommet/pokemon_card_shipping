<template>
    <form @submit.prevent="sendCard">
        <h4>Ajouter une carte</h4>
        <div>
            <label for='input1'>Montant 1 : </label>
            <input type="number" name="input1">
        </div>
        <div>
            <label for='input2'>Montant 2 : </label>
            <input type="number" name="input2">
        </div>
        <div>
            <label for='input3'>Montant 3 : </label>
            <input type="number" name="input3">
        </div>
        <button type="submit">Ajouter une carte</button>           
    </form>
</template>

<script setup>

import { getFirestore, collection, addDoc, serverTimestamp }  from 'firebase/firestore';
import { defineProps } from 'vue';

const firestore = getFirestore();

const auth = defineProps(['auth']);

async function sendCard(e) {

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    await addDoc(collection(firestore, "Cards"), {

      text1: formProps.input1,
      text2: formProps.input2,
      text3: formProps.input3,
      user: auth.auth.uid,
      status: "pending",
      createdAt: serverTimestamp(firestore),

    }).then(() => {
        alert("Envoyé avec succès");
    }).catch((error) => {
        console.log(error);
    });  
}
</script>

<style scoped>
form{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>