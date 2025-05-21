import axiosInstance from "@/utils/api.instance"

export type IcreateOrderItem = {
    productId: string,
    quantity: number,
    unitPrice: number
}

export type IcreateOrder = {
    buyerId: string,
    items: Array<IcreateOrderItem>
}

export type IbuyerId = {
    buyerId: string
}
export type Iremoveprops = {
    buyerId: string,
    orderId: string
}

const createOrder = async (values: IcreateOrder) => {
    try {

        const response = await axiosInstance.post('/order/create', values);

        return response.data;

    } catch (err) {
        console.log(err)
    }
}

const orderbyBuyerId = async (values: IbuyerId) => {
    try {

        const response = await axiosInstance.post('/order', values);

        return response.data;

    } catch (err) {
        console.log(err)
    }
}

const removeOrder = async (values: Iremoveprops) => {

    try {

        const response = await axiosInstance.post('/order/remove', values);

        return response.data;

    } catch (err) {
        console.log(err);
    }

}

export {
    createOrder,
    orderbyBuyerId,
    removeOrder
}