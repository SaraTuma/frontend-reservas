import { saveTokens } from "@/utils/token";
import publicApi from "./publicApi";

export class AuthService {

  static async login(emailOrNif: string, password: string) {
    const response = await publicApi.post(
      '/api/auth/login',
      {
        emailOrNif,
        password,
      }
    );
    const { token, data } = response.data;
    console.log("LOGIN RESPONSE: ", response.data);
    saveTokens({ token, user: JSON.stringify(data.user) });
    return response.data;
  }


  static async register( name:string, nif:string, email:string, password:string, role:string ) {
    const res = await publicApi.post('/api/auth/register',{
        name,nif,email,password,role
    });
    return res.data;
  }



}