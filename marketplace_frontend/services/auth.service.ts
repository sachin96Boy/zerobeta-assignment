import axiosInstance from "@/utils/api.instance"

export type IregisterProps = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    country: string | null
}
export type IloginProps = {
    email: string,
    password: string
}


const registerUser = async (values: IregisterProps) => {
    try {

        const response = await axiosInstance.post('/auth/register', values);

        return response.data;
    } catch (err) {
        console.log(err)
    }
}

const loginUser = async (values: IloginProps) => {

    try {
        const response = await axiosInstance.post('/auth/login', values);

        const { access_token, ...rest } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(rest));

    } catch (err) {
        console.log(err);
    }


}

export {
    loginUser,
    registerUser
}


