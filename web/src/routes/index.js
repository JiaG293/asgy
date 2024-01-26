
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import RegisterNext from '../pages/RegisterNext'

// khong can dang nhap van xem duoc
const publicRoutes = [
    {path:'/home', component:Home},
    {path:'/login', component:Login},
    {path:'/register', component:Register},
    {path:'/register-next', component:RegisterNext},
    {path:'/forgot-password', component:ForgotPassword},
]

//phai dang nhap moi xem duoc
const privateRoutes = []

export {publicRoutes, privateRoutes}