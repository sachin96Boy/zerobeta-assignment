import axiosInstance from "@/utils/api.instance";

export type IInventory = {
    productId: string,
    quantity: number,
    price: number
}

const updateInventory = async (values: IInventory) => {
    try {

        const response = await axiosInstance.post('/inventory');

        return response.data;

    } catch (err) {
        console.log(err);
    }
}

export {
    updateInventory
}