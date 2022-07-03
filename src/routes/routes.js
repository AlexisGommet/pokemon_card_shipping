export default [   
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/LogIn.vue'),
    },
    {
        path: '/passwordReset',
        name: 'passwordReset',
        component: () => import('../components/PasswordReset.vue'),
    },
    {
        path: '/signUp',
        name: 'signUp',
        component: () => import('../components/SignUp.vue'),
    },
    {
        path: '/addCard',
        name: 'addCard',
        component: () => import('../components/AddCard.vue'),
    },
    {
        path: '/basket',
        name: 'basket',
        component: () => import('../components/BasketShow.vue'),
    },
    {
        path: '/order',
        name: 'order',
        component: () => import('../components/OrderShow.vue'),
    },
    {
        path: '/checkoutSuccess',
        name: 'checkoutsuccess',
        component: () => import('../components/CheckoutSuccess.vue'),
    },
    {
        path: '/checkoutFailure',
        name: 'checkoutfailure',
        component: () => import('../components/CheckoutFailure.vue'),
    },
]
