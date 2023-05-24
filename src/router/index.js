import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/index.vue"),
    children: [
      {
        path: "/",
        component: () => import("../views/companies.vue"),
        name: "companies"
      },
      {
        path: ":id/mosaic",
        name: "Case32",
        component: () => import("../views/Mosaic.vue")
      },
      {
        path: ":id",
        component: () => import("../views/Home.vue"),
        children: [
          {
            path: "",
            name: "Home",
            component: () => import("../views/Homepage.vue")
          },
          {
            path: "step1",
            name: "step1",
            component: () => import("../views/Step1.vue")
          },
          {
            path: "step2",
            name: "step2",
            component: () => import("../views/Step2.vue")
          }
        ]
      }
    ]
  },
  { path: "*", component: () => import("../views/companies.vue") }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.VUE_APP_PUBLIC_PATH,
  routes
});

export default router;
