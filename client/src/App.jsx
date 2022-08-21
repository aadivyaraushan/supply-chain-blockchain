import { EthProvider } from './contexts/EthContext';
import './main.css';
import { Routes, Route } from 'react-router-dom';
import BuyerDashboard from './pages/Dashboards/Buyer.jsx';
import ShippingLine from './pages/Dashboards/ShippingLine.jsx';
import Supplier from './pages/Dashboards/Supplier.jsx';
import Trader from './pages/Dashboards/Trader.jsx';
import Welcome from './pages/Auth/Welcome';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import BuyerOrderPage from './pages/OrderPages/BuyerOrderPage';
import SupplierOrderPage from './pages/OrderPages/SupplierOrderPage';
import TraderOrderPage from './pages/OrderPages/TraderOrderPage';
import ShippingLineOrderPage from "./pages/OrderPages/ShippingLineOrderPage";

Amplify.configure(awsconfig);

function App() {
  return (
    <EthProvider>
      <Routes>
        <Route>
          <Route path='/' element={<Welcome />} />
          <Route path='/signUp' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/buyer/:address' element={<BuyerDashboard />} />
          <Route path='/buyer/:address/:hash' element={<BuyerOrderPage />} />
          <Route
            path='/supplier/:address/:hash'
            element={<SupplierOrderPage />}
          />
          <Route path='/supplier/:address' element={<Supplier />} />
          <Route path='/trader/:address' element={<Trader />} />
          <Route path='/trader/:address/:hash' element={<TraderOrderPage />} />
          <Route path='/shippingLine/:address' element={<ShippingLine />} />
          <Route path='/shippingLine/:address/:hash' element={<ShippingLineOrderPage />} />
        </Route>
      </Routes>
    </EthProvider>
  );
}

export default App;
