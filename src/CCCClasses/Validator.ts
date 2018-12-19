export class Validator {
    validatePassword(passwd: string) : string {
        if ( passwd.length < 8 ){
            return "Your password must be at least 8 characters long.";
        }
        return null;
    }

    validateUsername(username: string) : string {
        if (username.trim().length < username.length || username.indexOf(" ") != -1) {
            return "Username contains Spaces or blank chars";
        }

        return null;
    }
}