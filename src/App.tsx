import {Navigate,Route,Routes,useLocation} from "react-router-dom";
import {CustomerShell} from "./components/AppShell";
import {useStore} from "./contexts/StoreContext";
import {Account,Cart,Catalog,Checkout,Home,Login,ProductDetail,Promo,SimpleAuth,Stores} from "./pages/CustomerPages";
import {AdminShell,CategoriesAdmin,CustomersAdmin,Dashboard,OrdersAdmin,ProductsAdmin,PromosAdmin,SettingsAdmin} from "./pages/AdminPages";
import Users from "./pages/Users";
function AdminGate({children}:{children:React.ReactNode}){const{user}=useStore();if(!user)return <Navigate to="/login" replace/>;if(user.role==='buyer')return <Navigate to="/" replace/>;return <AdminShell>{children}</AdminShell>}
function Customer({children}:{children:React.ReactNode}){return <CustomerShell>{children}</CustomerShell>}
export default function App(){const location=useLocation();return <Routes>
 <Route path="/" element={<Customer><Home/></Customer>}/><Route path="/catalog" element={<Customer><Catalog/></Customer>}/><Route path="/product/:id" element={<Customer><ProductDetail/></Customer>}/><Route path="/cart" element={<Customer><Cart/></Customer>}/><Route path="/checkout" element={<Customer><Checkout/></Customer>}/><Route path="/promo" element={<Customer><Promo/></Customer>}/><Route path="/stores" element={<Customer><Stores/></Customer>}/><Route path="/account" element={<Customer><Account/></Customer>}/><Route path="/orders" element={<Customer><Account tab="orders"/></Customer>}/><Route path="/wishlist" element={<Customer><Account tab="wishlist"/></Customer>}/><Route path="/login" element={<Customer><Login/></Customer>}/><Route path="/register" element={<Customer><SimpleAuth type="register"/></Customer>}/><Route path="/forgot" element={<Customer><SimpleAuth type="forgot"/></Customer>}/>
 <Route path="/admin" element={<AdminGate><Dashboard/></AdminGate>}/><Route path="/admin/products" element={<AdminGate><ProductsAdmin/></AdminGate>}/><Route path="/admin/orders" element={<AdminGate><OrdersAdmin/></AdminGate>}/><Route path="/admin/users" element={<AdminGate><Users/></AdminGate>}/><Route path="/admin/customers" element={<AdminGate><CustomersAdmin/></AdminGate>}/><Route path="/admin/promos" element={<AdminGate><PromosAdmin/></AdminGate>}/><Route path="/admin/categories" element={<AdminGate><CategoriesAdmin/></AdminGate>}/><Route path="/admin/settings" element={<AdminGate><SettingsAdmin/></AdminGate>}/>
 <Route path="*" element={<Navigate to={location.pathname.startsWith('/admin')?'/admin':'/'} replace/>}/>
</Routes>}
