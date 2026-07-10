import { createContext, useContext, useState } from "react";

const BRANDS = {
  arc: {
    label: "navify Arc",
    viewBox: "0 0 18 18",
    paths: [
      "M9.99979 0.00390139C9.99629 1.52052 10.0138 2.91422 10.2292 4.07233C10.4417 5.21433 10.8336 6.04554 11.394 6.60595C11.9544 7.16635 12.7856 7.55826 13.9276 7.77072C15.0857 7.98613 16.4794 8.00367 17.996 8.00017L18 9.99972C16.5105 10.0032 14.9331 9.99104 13.5625 9.73611C12.1758 9.47819 10.9194 8.95882 9.98026 8.01969C9.04113 7.08056 8.52176 5.82412 8.26384 4.43748C8.00891 3.06687 7.9968 1.48942 8.00023 -3.81472e-06L9.99979 0.00390139Z",
      "M8.00015 17.996C8.00365 16.4793 7.98612 15.0856 7.77071 13.9275C7.55825 12.7855 7.16633 11.9543 6.60593 11.3939C6.04552 10.8335 5.2143 10.4416 4.07232 10.2291C2.9142 10.0137 1.5205 9.99619 0.003889 9.9997L-1.62125e-05 8.00014C1.48941 7.9967 3.06685 8.00882 4.43747 8.26375C5.82411 8.52167 7.08055 9.04105 8.01968 9.98017C8.95881 10.9193 9.47818 12.1757 9.73609 13.5624C9.99103 14.933 10.0031 16.5104 9.99971 17.9999L8.00015 17.996Z",
    ],
  },
  x: {
    label: "navify X",
    viewBox: "0 0 364 364",
    paths: [
      "M363.282 147.042L224.51 138.763L216.239 -8.41777e-06L173.366 42.8732L181.637 181.636L320.409 189.916L363.282 147.042Z",
      "M0 216.237L138.772 224.517L147.042 363.28L189.916 320.407L181.645 181.643L42.8732 173.364L0 216.237Z",
    ],
  },
};

const BrandContext = createContext({ brand: "arc", setBrand: () => {} });

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState("arc");
  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}

export function useBrandIcon() {
  const { brand } = useContext(BrandContext);
  return BRANDS[brand];
}

export { BRANDS };
