import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { WalletProvider } from "./Components/WalletProvider.tsx";
import "@rainbow-me/rainbowkit/styles.css";

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </Provider>
)
