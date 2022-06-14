export default [
    {
        path: '/addCard',
        name: 'addCard',
        component: () => import('../components/AddCard.vue'),
    },
    {
        path: '/basketShow',
        name: 'basketShow',
        component: () => import('../components/BasketShow.vue'),
    },
]
