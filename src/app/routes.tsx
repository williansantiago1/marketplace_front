import { createBrowserRouter } from "react-router-dom";
import { AdminShell } from "../components/layout/AdminShell";
import { PrivateRoute, RoleRoute } from "../components/layout/Guards";
import { SellerShell } from "../components/layout/SellerShell";
import { StorefrontShell } from "../components/layout/StorefrontShell";
import { CategoriesPage } from "../pages/admin/CategoriesPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { SellerCouponsPage } from "../pages/seller/SellerCouponsPage";
import { SellerHomePage } from "../pages/seller/SellerHomePage";
import { SellerOrdersPage } from "../pages/seller/SellerOrdersPage";
import { SellerProductsPage } from "../pages/seller/SellerProductsPage";
import { SellerStoresPage } from "../pages/seller/SellerStoresPage";
import { CartPage } from "../pages/storefront/CartPage";
import { CheckoutPage } from "../pages/storefront/CheckoutPage";
import { HomePage } from "../pages/storefront/HomePage";
import { LoginPage } from "../pages/storefront/LoginPage";
import { OrderDetailPage } from "../pages/storefront/OrderDetailPage";
import { OrdersPage } from "../pages/storefront/OrdersPage";
import { PaymentPage } from "../pages/storefront/PaymentPage";
import { ProductDetailPage } from "../pages/storefront/ProductDetailPage";
import { ProductsPage } from "../pages/storefront/ProductsPage";
import { RegisterPage } from "../pages/storefront/RegisterPage";
import { StorePage } from "../pages/storefront/StorePage";
import { RootLayout } from "./RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <StorefrontShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "produtos", element: <ProductsPage /> },
          { path: "produtos/:id", element: <ProductDetailPage /> },
          { path: "lojas/:slug", element: <StorePage /> },
          {
            path: "carrinho",
            element: (
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            ),
          },
          {
            path: "checkout",
            element: (
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            ),
          },
          {
            path: "pedidos",
            element: (
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            ),
          },
          {
            path: "pedidos/:id",
            element: (
              <PrivateRoute>
                <OrderDetailPage />
              </PrivateRoute>
            ),
          },
          {
            path: "pedidos/:id/pagar",
            element: (
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            ),
          },
          { path: "entrar", element: <LoginPage /> },
          { path: "cadastrar", element: <RegisterPage /> },
        ],
      },
      {
        path: "/vendedor",
        element: (
          <RoleRoute roles={["SELLER", "ADMIN"]}>
            <SellerShell />
          </RoleRoute>
        ),
        children: [
          { index: true, element: <SellerHomePage /> },
          { path: "lojas", element: <SellerStoresPage /> },
          { path: "produtos", element: <SellerProductsPage /> },
          { path: "cupons", element: <SellerCouponsPage /> },
          { path: "pedidos", element: <SellerOrdersPage /> },
        ],
      },
      {
        path: "/admin",
        element: (
          <RoleRoute roles={["ADMIN"]}>
            <AdminShell />
          </RoleRoute>
        ),
        children: [{ path: "categorias", element: <CategoriesPage /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
