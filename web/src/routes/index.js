
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'

// khong can dang nhap van xem duoc
const publicRoutes = [
    {path:'/home', component:Home},
    {path:'/login', component:Login},
    {path:'/sign-up', component:SignUp},


]

//phai dang nhap moi xem duoc
const privateRoutes = []

export {publicRoutes, privateRoutes}