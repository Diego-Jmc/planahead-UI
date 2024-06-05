import Cookies from "js-cookie"


export default function isUserAuth(){
        const token = Cookies.get('plan_ahead_user_token')
        const email = Cookies.get('plan_ahead_user_id')
        return token != undefined && email != undefined
}

// is user google auth