import axiosInstance from "@/utils/api.instance";

export type IProductProps = {
    code: string,
    name: string,
    description: string,
    price: number
}

const createProduct = async (values: IProductProps) => {
    try {

        const response = await axiosInstance.post('/product/product', values);

        return response.data

    } catch (err) {
        console.log(err);
    }
}
const getAllProduct = async () => {
    try {

        const response = await axiosInstance.get('/product');

        return response.data

    } catch (err) {
        console.log(err);
    }
}

export {
    createProduct,
    getAllProduct
}