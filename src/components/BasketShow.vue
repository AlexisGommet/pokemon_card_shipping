<template>
    <div class="basket">
        <div v-for="(item, i) in docs" :key="i">
            <h4>Carte : {{ i + 1 }}</h4>
            <div>
                Montant 1 : {{ item.text1 }}
            </div>
            <br>
            <div>
                Montant 2 : {{ item.text2 }}
            </div>
            <br>
            <div>
                Montant 3 : {{ item.text3 }}
            </div>
            <br>
            <div>
                Ajoutée le : {{ new Date(item.createdAt.seconds * 1000).getDate()+"/"+(new Date(item.createdAt.seconds * 1000).getMonth()+1)+"/"+new Date(item.createdAt.seconds * 1000).getFullYear()+" à "+ new Date(item.createdAt.seconds * 1000).getHours()+":"+new Date(item.createdAt.seconds * 1000).getMinutes()+":"+new Date(item.createdAt.seconds * 1000).getSeconds() }}
            </div>
        </div>
    </div>
</template>

<script setup>

import { getFirestore, collection, orderBy, query, where, getDocs }  from 'firebase/firestore';
import { defineProps, ref, onMounted } from 'vue';

const firestore = getFirestore();

const auth = defineProps(['auth']);

const getquery = query(collection(firestore, "Cards"), where("user", "==", auth.auth.uid), where("status", "==", "pending"), orderBy("createdAt"));

const docs = ref();

async function getItems(){
    let list = [];
    await getDocs(getquery).then((documents) => {
        documents.forEach((doc) => {
            list.push(doc.data());
        });
        docs.value = list;
    });
}

onMounted( () => {

    getItems();

});

</script>

<style scoped>
.basket{
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

</style>