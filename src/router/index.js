import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../components/LoginPage.vue";
import RegisterClient from "../components/RegisterClient.vue";
import UpdateClientAccount from "../components/UpdateClientAccount.vue";
import RegisterDevice from "../components/RegisterDevice.vue";
import UpdateDevice from "../components/UpdateDevice.vue";

//lazy-loaded
const ClientHome = () => import("../views/ClientHomeView.vue");
const AdminHome = () => import("../views/AdminHomeView.vue");
const ChatHome = () => import("../views/ChatHome.vue");
const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/ClientHome",
    name: "ClientHome",
    component: ClientHome,
  },
  {
    path: "/AdminHome",
    name: "AdminHome",
    component: AdminHome,
  },
  {
    path: "/RegisterClient",
    name: "RegisterClient",
    component: RegisterClient,
  },
  {
    path: "/RegisterDevice",
    name: "RegisterDevice",
    component: RegisterDevice,
  },
  {
    path: "/UpdateClientAccount",
    name: "UpdateClientAccount",
    component: UpdateClientAccount,
  },
  {
    path: "/UpdateDevice",
    name: "UpdateDevice",
    component: UpdateDevice
  },
  {
    path: "/ChatHome",
    name: "ChatHome",
    component: ChatHome
  }

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  else if (user && user.role === 'ADMIN' && to.path === '/ClientHome') {
    return next('/AdminHome');
  }
  else if (user && user.role === 'USER' && to.path != '/ClientHome' && to.path != '/ChatHome') {
    return next('/ClientHome');
  }
  
  return next();
  
  
})


export default router;