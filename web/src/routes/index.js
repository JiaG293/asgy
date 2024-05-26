
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import Test from '../socket/Test.js'

// khong can dang nhap van xem duoc
const publicRoutes = [
    {path:'/login', component:Login},
    {path:'/register', component:Register},
    {path:'/forgot-password', component:ForgotPassword},
    {path: '/test', component: Test},
    // {path:'/home', component:Home},

]

//phai dang nhap moi xem duoc
const privateRoutes = [
    {path:'/home', component:Home},
]

export {publicRoutes, privateRoutes}