<template>
    <div class="basket">
        <button @click="checkout" class="signOut">Checkout</button>
        <div v-for="(item, i) in docs" :key="i">
            <h4>Carte {{ i + 1 }}<button class="delete" @click="deleteCard(item.id)">X</button></h4>
            <div>
                Propriété 1 : {{ item.text1 }}
            </div>
            <br>
            <div>
                Propriété 2 : {{ item.text2 }}
            </div>
            <br>
            <div>
                Propriété 3 : {{ item.text3 }}
            </div>
            <br>
            <div>
                Ajoutée le : {{ getDate(item) }}
            </div>      
        </div>
    </div>
</template>

<script setup>

import { getFirestore, collection, orderBy, query, where, getDocs, deleteDoc, doc }  from 'firebase/firestore';
import { defineProps, ref, onMounted } from 'vue';

const firestore = getFirestore();

const auth = defineProps(['auth']);

const getquery = query(collection(firestore, "Cards"), where("user", "==", auth.auth.uid), where("status", "==", "pending"), orderBy("createdAt"));

const docs = ref();

async function getItems(){

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

function getDate(item){

    const date = new Date(item.createdAt.seconds * 1000);
    const days = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
    const year = date.getFullYear();
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return `${days}/${month}/${year} à ${hours}:${minutes}:${seconds}`
}

async function deleteCard(id){

    await deleteDoc(doc(firestore, "Cards", id)).then(() => {
        docs.value.splice(docs.value.findIndex(item => item.id === id), 1);
    }).catch((error) => {
        console.log(error);
    });  
}

async function checkout(){

    let idList = [];

    docs.value.forEach((item) => {
        idList.push(item.id);
    });

    const body = {
        "quantity": ""+docs.value.length+"",
        "idList": ""+idList+""
    };

    try{

        const response = await fetch('https://us-central1-pokemoncardshipping.cloudfunctions.net/checkout', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'},
        });
        
        const redirect = await response.json()
        window.location.href = redirect.url;

    }catch(e){
        window.alert("Erreur");
    }
    
}

onMounted( () => {
    getItems();
});

</script>

<style scoped>
.basket{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
.delete{
    margin-left: 150px;
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