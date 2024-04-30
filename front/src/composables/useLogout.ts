import { COOKIE_KEY, useCookiesStore } from "@/stores/cookie-store";
import { useRouter } from "vue-router";

export function useLogout(){

    const cookies = useCookiesStore();
    const router = useRouter();

    function back(){ router.go(-1); }
    function logout(){
        cookies.isKey( COOKIE_KEY.USER ) && cookies.remove( COOKIE_KEY.USER );
        cookies.isKey( COOKIE_KEY.JWT ) && cookies.remove( COOKIE_KEY.JWT );

        router.push('/');
    }

    return {
        back, logout
    }
}