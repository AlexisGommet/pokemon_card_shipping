<template>
    <div class="message">
        Merci pour votre achat, il ne vous reste plus qu'à nous envoyé les cartes et on s'occupe du reste.
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