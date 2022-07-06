<template>
    <div class="message">
        Oh oh! Quelque chose semble s'être mal passé...
    </div>
</template>

<script setup>


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

:root {
  color-scheme: only light;
}

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
    font-family: 'Roboto';
    font-weight: bold;
    font-size: xx-large;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>