import Cookies from "js-cookie"


export default function isUserAuth(){
        const token = Cookies.get('plan_ahead_user_token')
        const email = Cookies.get('plan_ahead_user_email')
        return token != undefined && email != undefined
}