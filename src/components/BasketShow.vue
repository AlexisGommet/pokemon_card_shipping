<template>
    <div class="basket">
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
                Ajoutée le : {{ new Date(item.createdAt.seconds * 1000).getDate()+"/"+(new Date(item.createdAt.seconds * 1000).getMonth()+1)+"/"+new Date(item.createdAt.seconds * 1000).getFullYear()+" à "+ new Date(item.createdAt.seconds * 1000).getHours()+":"+new Date(item.createdAt.seconds * 1000).getMinutes()+":"+new Date(item.createdAt.seconds * 1000).getSeconds() }}
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

async function deleteCard(id){
    await deleteDoc(doc(firestore, "Cards", id)).then(() => {
        docs.value.splice(docs.value.findIndex(item => item.id === id), 1);
    }).catch((error) => {
        console.log(error);
    });  
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
</style>