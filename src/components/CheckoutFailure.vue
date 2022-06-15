<template>
    <div class="message">
        Oh oh! Quelque chose semble s'est mal passé...
    </div>
</template>

<script setup>


</script>

<style scoped>
.message{
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
</style>