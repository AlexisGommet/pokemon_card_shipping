<template>
    <div v-if="isAuthenticated">

        <ModalShow v-if="showModal" :text="modalText" :color="modalColor" style="top: 0px;"/>
        
        <div v-if="docs" class="basket">
            <button v-if="docs.length > 0" @click="goToOrder" class="signOut">Commander</button>
            <div v-else class="empty">Le panier est vide</div>    
            <div v-for="(item, i) in docs" :key="i" class="card">
                <div class="top"><h2>Carte {{ i + 1 }}</h2><div class="delete" @click="deleteCard(item.id)">X</div></div>
                <div>
                    Nom de la carte : {{ item.name }}
                </div>
                <br>
                <div>
                    Numéro : {{ item.number }}
                </div>
                <br>
                <div>
                    Série : {{ item.series }}
                </div>
                <br>
                <div>
                    Langue : {{ item.language }}
                </div>
                <br>
                <div>
                    Service Value : {{ item.service ? "Oui" : "Non" }}
                </div>
                <br>
                <div>
                    Valeur déclarée : {{ item.value }}
                </div>
                <br>
                <div>
                    Commentaire : {{ item.comment }}
                </div>
                <br>
                <div>
                    Ajoutée le : {{ getDate(item) }}
                </div>      
            </div>
        </div>

        <RingLoader v-else :color="'#505257'" :size="100" class="loader"/>

    </div>

    <LogIn v-else/>

</template>

<script setup>
import { useAuth } from '@vueuse/firebase/useAuth';
import { getFirestore, collection, orderBy, query, where, getDocs, deleteDoc, doc }  from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import RingLoader from './RingLoader';
import LogIn from './LogIn.vue';
import ModalShow from './ModalShow.vue';

const router = useRouter();

const firestore = getFirestore();

const auth = getAuth();
const { isAuthenticated, user } = useAuth(auth);

const docs = ref();
const showModal = ref(false);
const modalText = ref("");
const modalColor = ref("");

onMounted( () => {
    getItems();
});

function goToOrder(){
    router.push({name: 'order'})
}

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

function getDate(item){

    const date      = new Date(item.createdAt.seconds * 1000);
    const days      = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month     = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
    const year      = date.getFullYear();
    const hours     = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes   = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const seconds   = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return `${days}/${month}/${year} à ${hours}:${minutes}:${seconds}`
}

async function deleteCard(id){

    try{
        await deleteDoc(doc(firestore, "Cards", id));
        docs.value.splice(docs.value.findIndex(item => item.id === id), 1);
        slideModal("Carte supprimée avec succès", "green");
    }catch(error){
        console.log(error);
        slideModal("Une erreur est survenue", "red");
    }
    
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

.empty{
    font-family: 'Roboto';
    font-weight: bold;
    font-size: xx-large;
}
.top{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
}
.card{
    display: flex;
    flex-direction: column;
    background: rgb(243, 243, 243);
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
    padding: 20px;
    border-radius: 10px;
    font-family: 'Roboto';
    font-weight: bold;
}
.basket{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    width: 500px;
    margin: 100px auto;
    word-break: break-word;
}
.delete{
    margin-left: 100px;
    cursor: pointer;
    font-family: 'Roboto';
    font-weight: bold;
    font-size: large;
}
.signOut{
    padding: 10px 35px;
    width: 175px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 24px;
    box-shadow: rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0;
    color: #3c4043;
    cursor: pointer;
    border-style: none;
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    letter-spacing: .5px;
    line-height: normal;
    text-align: center;
    transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1),opacity 15ms linear 30ms,transform 270ms cubic-bezier(0, 0, .2, 1) 0ms;
}
.signOut:hover {
  background: #F6F9FE;
  color: #174ea6;
}

.signOut:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.loader{
    display: flex;
    top: 300px;
    margin: 100px auto;
}

@media only screen and (max-width: 500px) {
    .basket{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -4%);
        margin-top: 200px;    
    }
}
@media only screen and (max-width: 550px) {
    .card{
        width: 300px;
    }
}

@media only screen and (max-width: 350px) {
    .card{
        width: 225px;
    }
}
</style>