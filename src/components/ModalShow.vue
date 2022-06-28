<template>
    <div id="modalContainer" :class="{ red: isRed, green: isGreen }">
        {{ text }} 
        <div v-if="logo" style="display: inline-block;">&#10003;</div>
        <div v-else style="display: inline-block;">&#x58;</div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['text', 'color']);

const isRed = ref(false);
const isGreen = ref(false);
const text = ref(props.text);


if(props.color === "red"){
    isRed.value = true;
}else if(props.color === "green"){
    isGreen.value = true;
}

const logo = ref(isGreen.value ? true : false);
</script>

<style scoped>

.green{
    color: aquamarine;
}

.red{
    color: brown;   
}

#modalContainer{
    display: flex;   
    position: absolute;
    gap: 10px;
    justify-content: center;
    align-items: center;
    background: rgb(42, 41, 41);
    font-size: large;
    left: 50%;
    transform: translate(-50%, -100px);
    border-radius: 15px;
    width: 300px;
    height: 50px;
    z-index: 100;
    font-family: 'Roboto';
    font-weight: bold;
    animation: slide 5s ease-in-out;
}

@keyframes slide {
    0% {
        transform: translate(-50%, -100px);
    }
    15% {
        transform: translate(-50%, 75px);
    }
    85% {
        transform: translate(-50%, 75px);
    }
    100% {
        transform: translate(-50%, -100px);
    }
}

</style>
