import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginPage from '../components/LoginForm.vue';
import StudentPage from '../components/students/StudentList';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'login', component: LoginPage },
  {
    path: '/students',
    name: 'students',
    component: StudentPage,
    props: true,
    children: [
      {
        path: '/edit-student',
        name: 'edit-student',
        component: () => import('@/components/students/AddEditStudent.vue'),
        props: (route) => ({
          ...route.params
        })
      },
      {
        path: '/add-student',
        name: 'add-student',
        component: () => import('@/components/students/AddEditStudent.vue')
      },
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router
