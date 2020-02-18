class AuthService {

    static getToken() {
        // return Cookies.get("token");
        // console.log(localStorage.getItem("token_expire"), localStorage)
        return localStorage.getItem("token_expire")
    }

    static isLoggedIn() {
        // console.log(this.getToken(), Cookies.get());
        const token = this.getToken()
        if (!token) return false;

        if (this.isTokenExpired(token)) {
            // this.logout();
            localStorage.removeItem("token_expire")
            return false;
        }

        return true;
    }

    static isTokenExpired(token) {
        try {
            // const decoded = decode(token);
            if (token < Date.now()) { // Checking if token is expired.
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }
}

export default AuthService;