import axios from "axios";

const isProd = import.meta.env.MODE === "production";

export const api = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_BASE_URL_PROD
    : import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const productRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_PRODUCT_ROUTE_PROD
    : import.meta.env.VITE_PRODUCT_ROUTE,
  withCredentials: true,
});

export const categoryRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_CATEGORY_ROUTE_PROD
    : import.meta.env.VITE_CATEGORY_ROUTE,
  withCredentials: true,
});

export const cartItemRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_CART_ITEM_ROUTE_PROD
    : import.meta.env.VITE_CART_ITEM_ROUTE,
  withCredentials: true,
});

export const sendEmailRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_SEND_EMAIL_ROUTE_PROD
    : import.meta.env.VITE_SEND_EMAIL_ROUTE,
});

export const addressRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_ADDRESS_ROUTE_PROD
    : import.meta.env.VITE_ADDRESS_ROUTE,
});
export const paymentRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_PAYMENT_ROUTE_PROD
    : import.meta.env.VITE_PAYMENT_ROUTE,
});

export const orderRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_ORDER_ROUTE_PROD
    : import.meta.env.VITE_ORDER_ROUTE,
});

export const sellerStatsRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_SELLER_STATS_ROUTE_PROD
    : import.meta.env.VITE_SELLER_STATS_ROUTE,
});

export const addProductRoute = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_ADD_PRODUCT_ROUTE_PROD
    : import.meta.env.VITE_ADD_PRODUCT_ROUTE,
});
