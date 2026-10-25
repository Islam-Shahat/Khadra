import { BrowserRouter } from "react-router-dom";
import ProductsList from "./components/products/ProductsList";

export default function App() {
  return (
    <BrowserRouter>
      <ProductsList />
    </BrowserRouter>
  );
}
