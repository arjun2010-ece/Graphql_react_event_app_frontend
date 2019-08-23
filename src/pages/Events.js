import React, { Component, Fragment, createRef } from 'react'
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
 state = {
   creating: false
 };

 static contextType = AuthContext;

 constructor(props){
   super(props);
   this.titleElRef = createRef();
   this.priceElRef = createRef();
   this.dateElRef = createRef();
   this.descriptionElRef = createRef();
 }

 componentDidMount(){
   this.fetchEvents();
 }
 startCreateEventHandler = () => {
  this.setState({ creating: true });
 }

 modalConfirmHandler = () => {
  this.setState({ creating: false });
  const title = this.titleElRef.current.value;
  const price = +this.priceElRef.current.value;
  const date = this.dateElRef.current.value;
  const description = this.descriptionElRef.current.value;

  if(
    title.trim().length === 0 ||
    price <= 0 ||
    date.trim().length === 0 ||
    description.trim().length === 0
  ){
    return;
  }
  const event = {title, price, date, description };
  // console.log(event);

   const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", 
          price: ${price} ,date: "${date}"}) {
            _id
            title
            description
            price
            date
            creator{
              _id
              email
            }
          }
        }
      `
    };

  const token = this.context.token;

  fetch('http://localhost:8000/graphql', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token
    }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
    })
    .catch(err => {
      console.log(err);
    });

}

 modalCancelHandler = () => {
  this.setState({ creating: false });
 }

 fetchEvents(){
  const requestBody = {
    query: `
        query {
            events {
                _id
                title
                description
                price
                date
                creator{
                  _id
                  email
                }
          }
      }
    `
  };


fetch('http://localhost:8000/graphql', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => {
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Failed!');
    }
    return res.json();
  })
  .then(resData => {
    console.log(resData);
  })
  .catch(err => {
    console.log(err);
  });

 }

 render() {
  return (
   <Fragment>
    {this.state.creating && <Backdrop onCancel={this.modalCancelHandler} />}
    {this.state.creating && 
    <Modal title="Add Event" canCancel canConfirm
                 onCancel={this.modalCancelHandler} 
                 onConfirm={this.modalConfirmHandler} >
     <form>

       <div className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" ref={this.titleElRef} />
       </div>

       <div className="form-control">
          <label htmlFor="price">Price</label>
          <input type="number" id="price" ref={this.priceElRef} />
       </div>

       <div className="form-control">
          <label htmlFor="date">Date</label>
          <input type="datetime-local" id="date" ref={this.dateElRef} />
       </div>

       <div className="form-control">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows="4" ref={this.descriptionElRef} />
       </div>

     </form>
    </Modal>
  }
    { this.context.token && <div className="events-control">
      <p>Share your own Events</p>
      <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
    </div> }

    <ul className="events__list">
        <li className="events__list-item">Test</li>
        <li className="events__list-item">Test</li>
    </ul>
   </Fragment>
  )
 }
}
export default EventsPage;