export default [
    {
        path: '/',
        name: '/',
        component: () => import('../App.vue'),
    },
    
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
