import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Table from "@/components/Table";
import Input from "@/components/input";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;
const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px rgba(0, 0, 0, 0.1);
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;
//here
const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
  }
`;

export default function CartPage(params) {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnWrapper>
            <Box>
              <h1>Thanks for your order</h1>
              <p>We will email you for details</p>
            </Box>
          </ColumnWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnWrapper>
          <Box>
            <h2>Cart</h2>

            {!cartProducts.length && <div>Your cart is empty</div>}
            {products?.length > 0 && (
              <Table>

             
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quality</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="product" />
                        </ProductImageBox>
                        <div>{product.title}</div>
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>

                        <Button onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>
                      <td>
                        {/* Fix the price. Doesn't work plus items.  */}
                        $
                        {cartProducts.filter((id) => id === product._id)
                          .length * product.price}
                      </td>
                    </tr>
                  ))}
                  
                  <tr>
                    <td></td>
                    <td></td>
                    <td>${total}</td>
                  </tr>
                </tbody>
               </Table>
            )}
          </Box>

          {!!cartProducts?.length && (
            <Box>
              <h2>Order Info</h2>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                name={"name"}
                onChange={(ev) => setName(ev.target.value)}
              ></Input>
              <Input
                type="text"
                placeholder="Email"
                value={email}
                name={"email"}
                onChange={(ev) => setEmail(ev.target.value)}
              ></Input>
              <CityHolder>
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  name={"city"}
                  onChange={(ev) => setCity(ev.target.value)}
                ></Input>
                <Input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  name={"postalCode"}
                  onChange={(ev) => setPostalCode(ev.target.value)}
                ></Input>
              </CityHolder>
              <Input
                type="text"
                placeholder="Street Address"
                value={streetAddress}
                name={"streetAddress"}
                onChange={(ev) => setStreetAddress(ev.target.value)}
              ></Input>
              <Input
                type="text"
                placeholder="Country"
                value={country}
                name={"country"}
                onChange={(ev) => setCountry(ev.target.value)}
              ></Input>

              <Button onClick={goToPayment} black block>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnWrapper>
      </Center>
    </>
  );
}
