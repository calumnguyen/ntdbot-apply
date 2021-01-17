import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import { barcodeUpdateProduct, getAllProducts } from "../../actions/product";
import { getCustomer } from "../../actions/customer";
import { addNewRentProduct } from "../../actions/rentproduct";


class RentOrder extends Component {
  state = {
    id: "",
    orderNumber: "",
    barcode_Array: [],
    customer_id: "",
    product_Array: "",
    total_amt: "",
    taxper: "",
    tax: "",
    insAmt: "",
    rentDate: "",
    returnDate: "",
    total: "",
    saving: false,
  };


  async componentDidMount() {
    await this.props.getAllProducts();

    const { data } = this.props.location;
    if (data) {
      this.setState({
        // id: id,
        customer_id: data.customer_id,
        barcode_Array: data.barcode
      });
    }
    await this.props.getCustomer(this.state.customer_id);


  }


  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });

    const state = { ...this.state };
    const { user } = this.props.auth;

    const { barcode_Array } = this.state;
    let barcodeArr = [];
    barcode_Array.forEach((element) => {
      barcodeArr.push(element.barcode)
    })


    const product = {
      orderNumber: state.orderNumber,
      customer: state.customer_id,
      user: user._id,
      barcodes: barcodeArr,
      total: state.total,
      returnDate: state.returnDate,
      rentDate: state.rentDate,
    };
    await this.props.addNewRentProduct(product);

    
    // loop through all selected barcodes
  let { product_Array } = this.state;
  let { products } = this.props;
 // get product 
if(product_Array){
  product_Array.forEach((product,index)=>{
    let product_id = product.product_id;
      // products.forEach(())
  })
}     
      // update product add rented: true to barcode
    // save

    this.setState({ saving: false });
  };
  onHandleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // return sorted products for barcodes 
  getSortedData = (products) => {
    // looping through prducts
    let rows = [];
    products.forEach((product, p_index) => {
      let product_name = product.name;
      let product_id = product._id;

      // looping through each color of current product
      if (product.color) {
        product.color.forEach((color, c_index) => {
          let color_name = color.colorname;
          let color_id = color._id;

          // looping through sizes of current color
          if (color.sizes) {
            color.sizes.forEach((size, s_index) => {
              let size_name = size.size;
              let size_id = size.id;
              let price = size.price
              let length;
              // show sizes with barcode
              if (size.barcodes) {
                length = size.barcodes.length;
              } else {
                length = 0;
              }

              let i;
              for (i = 0; i < length; i++) {
                let row = {

                  product_id: product_id,
                  color_id: color_id,
                  size_id: size_id,
                  title: product_name + " | " + color_name + " | " + size_name,
                  barcodes: (size.barcodes) ? size.barcodes : [],
                  price: price
                };
                rows.push(row);
              }

            });
          }
        });
      }
    }); // products foreach ends here
    return rows;

  };



  removeBarcodeRow = (b_index, bbarcode) => {
    let barcode_Array = this.state.product_Array;
    let selectedBarcodes = this.state.barcode_Array;
    selectedBarcodes.splice(b_index, 1);
    barcode_Array.splice(b_index, 1);
    this.setState({
      product_Array: barcode_Array,
      barcode_Array: selectedBarcodes
    })

  }
  getBarcodeRecord() {
    let productarray = [];
    let { barcode_Array } = this.state;

    const { products } = this.props;
   
    if (products) {
      let sortedAray = this.getSortedData(products);
      if (sortedAray) {

        barcode_Array.forEach((element => {
          productarray.push(sortedAray.filter(f => f.barcodes.some(o => o.barcode === element.barcode)));
          return productarray
        }));

      }
    }
    this.state.product_Array = productarray;

    return this.state.product_Array.map((barcode, b_index) => (
      // <div id="sizes_box" key={barcode.id || barcode._id}>
      <div id="sizes_box" key={b_index}>
        <div className="row">
          <div className="left" >
            <input
              type="text"
              className="form-control mm-input s-input text-center"
              placeholder="Barcode"
              name="barcode"
              id="widthBr"
              style={{ 'width': '60%' }}
              value={barcode && barcode[0].title && barcode[0].title + ' | ' + barcode_Array[b_index].barcode}
            />

            <input
              type="text"
              className="form-control mm-input s-input text-center"
              placeholder="Price"
              id="setSize"
              name="total"

              value={`${barcode && barcode[0].price}`}

            />
          </div>
          <div className="right">
            <button
              type="button"
              onClick={() => this.removeBarcodeRow(b_index, barcode_Array[b_index].barcode)}
              className="btn btn-raised btn-sm btn-icon btn-danger mt-1">
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <div className="right">
            <button
              type="button"
              className="btn btn-raised btn-sm btn-success mt-1" ><i className="=ft ft-edit"></i></button>
          </div>
        </div>


      </div>
    ))

  }


  calculateTotalWithoutTax = () => {
    let sum = 0;
    let { product_Array } = this.state;
    if (product_Array) {
      for (var i = 0; i < product_Array.length; i++) {
        sum += Number(product_Array[i][0].price);
      }
    }
    this.state.total_amt = sum;
    return sum;
  }

  calculateTax = () => {
    var totalAmount = this.calculateTotalWithoutTax();
    var { taxper } = this.state;
    let amount;
    if (taxper !== null) {
      amount = totalAmount / taxper;
    }
    this.state.tax = amount
    return amount;
  }
  calculateInsuranceAmt() {
    var totalAmount = this.calculateTotalWithoutTax();
    var insuranceAmt = totalAmount / 2;
    this.state.insAmt = insuranceAmt;
    return insuranceAmt;
  }
  calculateTotal = () => {
    let sum = 0;
    let { tax, insAmt, total_amt } = this.state;
    sum = total_amt + tax + insAmt;
    this.state.total = sum;
    return sum;

  }



  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }

    if (this.props.saved) {
      return <Redirect to="/RentInvoice" />;
    }
    const { customer } = this.props;
    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location} >
          </Sidebar>
          <Header>
          </Header>
          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <section id="form-action-layouts">
                  <div className="form-body">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="card-title">Rent a Product</h4>
                      </div>
                      <div className="card-content">

                        <div className="card-body table-responsive">
                          <div id="colors_box">
                            <div className="row color-row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <h3>{customer && customer.name} {`${"#"}${customer && customer.contactnumber}`}</h3>
                                </div>
                              </div>
                              <form onSubmit={(e) => this.onSubmit(e)}>

                                <div className="col-md-12">
                                  <div id="sizes_box">
                                    {this.getBarcodeRecord()}
                                    <Link to="/product/addproduct"
                                      className="btn "><i className="fa fa-plus"></i>
                                 Go Back To Add Products
                                 </Link>

                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ 'float': 'left' }}>

                                            <h4 id="padLeft">Total Without Tax</h4>
                                          </div>
                                          <div style={{ 'paddingLeft': '650px' }}>
                                            <input
                                              style={{ 'width': '65%' }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Total"
                                              name="total_amt"
                                              id="setSizeFloat"
                                              onChange={(e) => this.onHandleChange(e)}
                                              value={this.state.product_Array ? `${this.calculateTotalWithoutTax()}` : ""}


                                            />
                                          </div>
                                          <br />
                                        </div> </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ 'float': 'left' }}>
                                            <h4 id="padLeft">Enter tax % <span className="text-muted">(enter 0 if no tax)</span></h4>
                                          </div>
                                          <div style={{ 'paddingLeft': '650px' }}>
                                            <input
                                              style={{ 'width': '65%' }}
                                              name="taxper"
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Tax"
                                              id="setSizeFloat"
                                              value={`${this.state.taxper}`}
                                              onChange={(e) => this.onHandleChange(e)}

                                            />
                                          </div>  </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">

                                          <h4 id="arowDown"><i className="ft-arrow-down"></i></h4>
                                          <div style={{ 'paddingLeft': '650px' }}>
                                            <input
                                              style={{ 'width': '65%' }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Tax Ammount"
                                              id="setSizeFloat"
                                              value={(this.state.product_Array && this.state.taxper) ? `${this.calculateTax()}` : ""}
                                            />
                                          </div>                             </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ 'float': 'left' }}>

                                            <h4 id="padLeft">Enter Insurance Amount</h4>
                                          </div>
                                          <div style={{ 'paddingLeft': '650px' }}>
                                            <input
                                              style={{ 'width': '65%' }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Insurance"
                                              id="setSizeFloat"
                                              value={this.state.total_amt ? `${this.calculateInsuranceAmt()}` : ""} />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ 'float': 'left' }}>

                                            <h4 id="padLeft">Leave ID</h4>
                                          </div>
                                          <div style={{ 'float': 'right', 'paddingRight': '170px' }}>

                                            <div className="custom-radio">
                                              <input
                                                type="radio"
                                                className="custom-control-input" />
                                              <label
                                                className="custom-control-label"
                                                htmlFor="customRadioInline1">YES</label>
                                            </div>
                                            <div className="custom-radio">
                                              <input
                                                type="radio"
                                                className="custom-control-input" />
                                              <label
                                                className="custom-control-label"
                                                htmlFor="customRadioInline2">NO</label>
                                            </div>                    </div>
                                        </div>
                                      </div>
                                    </div>

                                    <br />


                                    <div className="row" >

                                      <div className="col-md-6 text-center">
                                        <label
                                          className="text-center"
                                          id="setName">Rent Date</label>

                                      </div>

                                      <div className="col-md-6 text-center">

                                        <label className="text-center"
                                          id="setName">Return Date</label>

                                      </div>
                                    </div>

                                    <br />


                                    <div className="row justify-content-center"  >

                                      <div className="col-md-6">
                                        <input
                                          type="date"
                                          id="issueinput3"
                                          className="form-control round text-center"
                                          name="rentDate"
                                          data-toggle="tooltip"
                                          data-trigger="hover"
                                          data-placement="top"
                                          data-title="Rent Date"
                                          onChange={(e) => this.onHandleChange(e)}
                                          value={this.state.rentDate} />
                                      </div>

                                      <div className="col-md-6">

                                        <input
                                          type="date"
                                          id="issueinput4"
                                          className="form-control round text-center"
                                          name="returnDate"
                                          data-toggle="tooltip"
                                          data-trigger="hover"
                                          data-placement="top"
                                          data-title="Return Date"
                                          onChange={(e) => this.onHandleChange(e)}
                                          value={this.state.returnDate}
                                        />
                                      </div>

                                    </div>

                                    <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ 'float': 'left' }}>
                                            <h4 id="padLeft">Total</h4>
                                          </div>
                                          <div style={{ 'paddingLeft': '650px' }}>
                                            <input
                                              style={{ 'width': '65%' }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Total"
                                              id="setSizeFloat"
                                              value={this.state.tax ? `${this.calculateTotal()}` : ""}

                                            // value={`${"Total: $"}${this.state.tax ? (this.calculateTotal()) : ""}`} 
                                            />


                                          </div> </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br />
                                  <div className="row text-center">
                                    <div className="col-md-12 btn-cont">
                                      <div className="form-group">
                                        <Link
                                          to={{
                                            pathname: "/RentInvoice",
                                            data: {
                                              data: this.state
                                            }
                                          }}
                                          type="submit"
                                          className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                          id="btnSize2" ><i className="ft-check"></i>
                                                 Submit &amp; Get Invoice
                                          </Link>

                                      </div>
                                    </div>


                                  </div>
                                </div>
                              </form>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div></div>

                </section>

              </div>

            </div>

            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2"><span>Powered by &nbsp;{" "}
                <a href="https://www.alphinex.com" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">Alphinex Solutions </a>, All rights reserved. </span></p>
            </footer>
          </div>
        </div>
      </React.Fragment>

    );
  }
}

RentOrder.propTypes = {
  saved: PropTypes.bool,
  getAllProducts: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  addNewRentProduct: PropTypes.func.isRequired,

  auth: PropTypes.object,
  products: PropTypes.array,
  customer: PropTypes.array,

};

const mapStateToProps = (state) => ({
  saved: state.rentproduct.saved,
  auth: state.auth,
  products: state.product.products,
  customer: state.customer.customer
});
export default connect(mapStateToProps, {
  getAllProducts, getCustomer, addNewRentProduct
})(RentOrder);