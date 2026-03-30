import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner, Button, Form } from "react-bootstrap";
import { getAllProducts } from "../utils/api";
import { useCart } from "../context/CartContext";

const Marketplace = () => {

  const [products,setProducts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");

  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try{

      const res = await getAllProducts();
      setProducts(res.data);

    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchProducts();
  },[]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if(loading){
    return (
      <div className="text-center py-5">
        <Spinner animation="border"/>
      </div>
    )
  }

  return (

  <div className="container py-4">

    <h2 className="mb-4">Marketplace</h2>

    <Form.Control
      className="mb-4"
      placeholder="Search product..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
    />

    <Row>

      {filtered.map(product => (

        <Col md={3} key={product.id} className="mb-4">

          <Card>

            <Card.Img
              src={`http://localhost:5000${product.image}`}
              style={{height:"200px",objectFit:"cover"}}
            />

            <Card.Body>

              <Card.Title>{product.name}</Card.Title>

              <Card.Text>

              ₦{product.price}

              </Card.Text>

              <Button
                variant="primary"
                onClick={()=>addToCart(product)}
              >

              Add to Cart

              </Button>

            </Card.Body>

          </Card>

        </Col>

      ))}

    </Row>

  </div>
  );
};

export default Marketplace;