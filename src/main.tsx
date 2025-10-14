import { createRoot } from 'react-dom/client'
import './index.css'
import 'rsuite/dist/rsuite.min.css';
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { WalletProvider } from "./Components/WalletProvider.tsx";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </Provider>
)
