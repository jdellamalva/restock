const Products = (props) => {
    const [items, setItems] = React.useState(products);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [mode, setMode] = React.useState('Customer');
    const {
      Card,
      Button,
      ButtonGroup,
      Container,
      Row,
      Col,
      Image,
      Input,
      ListGroup,
      Badge,
      InputGroup,
      FormControl,
      ToggleButton,
      ToggleButtonGroup,
    } = ReactBootstrap;
  
    //  Fetch Data
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("http://localhost:1337/products");
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "http://localhost:1337/products",
      {
        data: [],
      }
    );
  
    console.log(`Rendering Products ${JSON.stringify(data)}`);
  
    const addToCart = (name) => {
        let item = items.filter((item) => item.name == name);
        console.log(`add to Cart ${JSON.stringify(item)}`);
        setCart([...cart, ...item]);
        doFetch(query);
      };
  
    const deleteCartItem = (index) => {
      let newCart = cart.filter((item, i) => index != i);
      setCart(newCart);
    };
  
    let list = items.map((item, index) => {
        let n = index + 1049;
        let url = "https://picsum.photos/id/" + n + "/50/50";
      
        let cartItemCount = cart.reduce((count, cartItem) => cartItem.name === item.name ? count + 1 : count, 0);
    
        return (
          <Card key={index} style={{ width: '100%', marginBottom: '8px'}}>
              <Card.Body style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={url} roundedCircle />
                    <div style={{ marginLeft: '4px' }}>
                        <Card.Text style={{ marginBottom: '4px' }}>{item.name}, ${item.cost} each</Card.Text>
                        <Card.Text style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>from {item.country}</Card.Text>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {mode === 'Customer' ? (
                        <>
                            <Button variant="primary" size="large" onClick={() => addToCart(item.name)} disabled={item.instock <= cartItemCount}>Add</Button>
                            {item.instock <= cartItemCount && <i style={{ color: 'red' }}>Out of stock</i>}
                        </>
                    ) : (
                        <i style={{ color: item.instock > 0 ? 'inherit' : 'red' }}>
                            {item.instock > 0 ? `Qty in stock: ${item.instock}` : 'Out of stock'}
                        </i>
                    )}
                </div>
            </Card.Body>
          </Card>
        );
    });

    const increaseItemCount = (name) => {
            let item = cart.find(item => item.name.replace(/:/g, '').replace(/s$/, '') === name);
            setCart([...cart, item]); // Add the item to the end of the cart
        };
      
    const decreaseItemCount = (name) => {
        let itemIndexInCart = cart.findIndex(item => item.name.replace(/:/g, '').replace(/s$/, '') === name); // Find the first occurrence of the item in the cart
        if (itemIndexInCart !== -1) {
            let newCart = [...cart];
            newCart.splice(itemIndexInCart, 1); // Remove the item from the cart
            setCart(newCart);
        }
    };

    const cartList = () => {
        let itemCounts = cart.reduce((obj, item) => {
          let name = item.name.replace(/:/g, '').replace(/s$/, '');
          obj[name] = (obj[name] || 0) + 1;
          return obj;
        }, {});
      
        return (
          <ListGroup as="ol" numbered>
            {Object.entries(itemCounts).map(([name, count], index) => {
                let itemInStock = items.find(item => item.name.replace(/:/g, '').replace(/s$/, '') === name).instock;
                return (
                    <ListGroup.Item 
                        as="li"
                        className="d-flex justify-content-between align-items-center"
                        key={1+index}>
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{name}</div>
                                ${cart.find(item => item.name.replace(/:/g, '').replace(/s$/, '') === name).cost} ea., from {cart.find(item => item.name.replace(/:/g, '').replace(/s$/, '') === name).country}
                            </div>
                            {count > 1 ? 
                                <InputGroup style={{width: '120px', marginBottom: 'none'}}>
                                    <FormControl aria-label="Item count" aria-describedby="basic-addon2" value={count} readOnly style={{ minWidth: '75px' }} />
                                    <ButtonGroup vertical>
                                        <Button onClick={() => increaseItemCount(name)} style={{ height: '19px', padding: '0px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} disabled={count >= itemInStock}>+</Button>
                                        <Button onClick={() => decreaseItemCount(name)} style={{ height: '19px', padding: '0px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>-</Button>
                                    </ButtonGroup>
                                </InputGroup> :
                            <Badge bg="primary" pill onClick={() => {
                                const itemIndexInCart = cart.findIndex(item => item.name.replace(/:/g, '').replace(/s$/, '') === name);
                                deleteCartItem(itemIndexInCart);
                            }} style={{ color: 'white', cursor: 'pointer' }}>X</Badge>
                            }
                    </ListGroup.Item>
                );
            })}
          </ListGroup>
        );
    };
  
    const finalList = () => {
        let total = getTotal();
        
        let itemCounts = cart.reduce((obj, item) => {
            let name = item.name.replace(/:/g,'');
            obj[name] = (obj[name] || 0) + 1;
            return obj;
        }, {});
        
        let final = Object.entries(itemCounts).map(([name, count], index) => {
            // Find the item in the cart
            let item = cart.find(item => item.name.replace(/:/g, '') === name);
        
            // Calculate the subtotal for the item
            let subtotal = item ? item.cost * count : 0;
        
            return (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <div>
                        {count > 1 ? `${count} ${name}s` : name}
                    </div>
                    <div>
                        ${subtotal.toFixed(2)}
                    </div>
                </div>
            );
        });
        
        return { final, total };
    };
  
    const getTotal = () => {
      let costs = cart.map((item) => item.cost);
      const reducer = (accum, current) => accum + current;
      let newTotal = costs.reduce(reducer, 0);
      console.log(`total updated to ${newTotal}`);
      return newTotal;
    };
    
    const checkOut = () => {
        // Calculate the total cost of the items in the cart
        let total = getTotal();
    
        // Show an alert with the total cost
        alert(`Your order for $${total} is confirmed. Thanks for shopping with us!`);
    
        // Update the in-stock count of the products
        let newItems = [...items];
        cart.forEach(cartItem => {
            let item = newItems.find(item => item.name === cartItem.name);
            if (item) {
                item.instock -= 1;
            }
        });
        setItems(newItems);
    
        // Clear the cart
        setCart([]);
    }

    const restockProducts = (url) => {
      doFetch(url);
      useEffect(() => {
          if (!isLoading) setItems(data);
      }, [data]);
    };

    const ModeToggle = ({mode, setMode}) => {
    
        const handleChange = (event) => setMode(event.target.value);
    
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div>
                    <input type="radio" id="customer" name="mode" value="Customer" checked={mode === 'Customer'} onChange={handleChange} />
                    <label htmlFor="customer" style={{ paddingLeft: '4px' }}>Customer</label>
                </div>
                <div>
                    <input type="radio" id="employee" name="mode" value="Employee" checked={mode === 'Employee'} onChange={handleChange} />
                    <label htmlFor="employee" style={{ paddingLeft: '4px' }}>Employee</label>
                </div>
            </div>
        );
    }
  
    return (
        <Container>
          <Row>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <ModeToggle mode={mode} setMode={setMode} />
                  {mode === 'Employee' && (
                      <form
                          onSubmit={(event) => {
                              restockProducts(`http://localhost:1337/${query}`);
                              console.log(`Restock called on ${query}`);
                              event.preventDefault();
                          }}
                      >
                          <input
                              type="text"
                              value={query}
                              onChange={(event) => setQuery(event.target.value)}
                          />
                          <button type="submit">Restock Products</button>
                      </form>
                  )}
              </div>
          </Row>
          <Row>
              <Col>
                  <h1>Our Products</h1>
                  <ul style={{ listStyleType: "none", paddingLeft: 0 }}>{list}</ul>
              </Col>
              {mode === 'Customer' && (
                  <>
                      <Col>
                          <h1>Your Cart</h1>
                          <div>{cartList()}</div>
                      </Col>
                      <Col>
                          <h1>Checkout</h1>
                          <div> {finalList().total > 0 && finalList().final} </div>
                          <Button onClick={checkOut}>Checkout: ${finalList().total}</Button>
                      </Col>
                  </>
              )}
          </Row>
        </Container>
    );
};