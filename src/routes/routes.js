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
    {
        path: '/checkoutsuccess',
        name: 'checkoutsuccess',
        component: () => import('../components/CheckoutSuccess.vue'),
    },
    {
        path: '/checkoutfailure',
        name: 'checkoutfailure',
        component: () => import('../components/CheckoutFailure.vue'),
    },
]
