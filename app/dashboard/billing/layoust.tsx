import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider options={{ clientId: 'AVbPTI4k_h8nqxEovyHQnTVkjWa5VC9qvZEvmSx6r2tBRc6xZyqtFXtWigc546TlOjkKSGDSFXiwndtE'}}>
         <PayPalButtons style={{ layout: "horizontal" }} />

      {/* {children} */}

    </PayPalScriptProvider>
  );
}
