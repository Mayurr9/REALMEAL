import axios from 'axios'
import moment from 'moment'
import { initAdmin } from './admin'
import Noty from 'noty'
import { initStripe } from './stripe'
// import {initUser} from './user' 


let addToCart = document.querySelectorAll('.add-to-cart')
let removeToCart = document.querySelectorAll(".remove-to-cart");
let cartCounter = document.querySelector('#cartCounter')
// let counterMain = document.querySelector('#counter-main')

function updateCart(realmeal, url, msg) {
    axios.post(url, realmeal).then(res => {
        cartCounter.innerText = res.data.totalQty
        // counterMain.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: msg,
            progressBar: false,
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let realmeal = JSON.parse(btn.dataset.realmeal)
        // if data fetched from session , there will be have "item object" => (cart.ejs)
        if (realmeal.item) {
            realmeal = realmeal.item;
        }
        let url = "/update-cart";
        updateCart(realmeal, url, "Item added to cart");
        setTimeout(function(){ window['location'].reload() }, 2000);
        });
    });
 
    removeToCart.forEach((btn) => {
        btn.addEventListener("click", (e) => {
        let realmeal = JSON.parse(btn.dataset.realmeal);
        let url = "/remove-cart";
        updateCart(realmeal.item, url, "Item removed From cart");
        setTimeout(function(){ window['location'].reload() }, 2000);
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')

// let orderInprogress = document.querySelector('#orderInprogress')
// let orderCancelled = document.querySelector('#orderCancelled')

let Order = hiddenInput ? hiddenInput.value : null
Order = JSON.parse(Order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
       status.classList.remove('step-completed')
       status.classList.remove('current')
   })
   let stepCompleted = true;
   statuses.forEach((status) => {
      let dataProp = status.dataset.status
      if(stepCompleted) {
           status.classList.add('step-completed')
      }
      if(dataProp === order.status) {
           stepCompleted = false
           time.innerText = moment(order.updatedAt).format('hh:mm A')
           status.appendChild(time)
          if(status.nextElementSibling) {
           status.nextElementSibling.classList.add('current')
          }
      }
      if(order.status === 'cancelled'){
      let orderInprogress = document.getElementById("orderInprogress").style.display = "none";
       let orderCancelled = document.getElementById("orderCancelled").style.display = "block";
      }else{
        let orderInprogress = document.getElementById("orderInprogress").style.display = "block";
        let orderCancelled = document.getElementById("orderCancelled").style.display = "none";
      }
      if((order.status === 'completed') || (order.status === 'cancelled')){
      let cancelOrder = document.getElementById("cancelOrder").style.display = "none";
      
      }else{
        let cancelOrder = document.getElementById("cancelOrder").style.display = "block";
        
      }
   })

}

updateStatus(Order);

// initUser() 

initStripe()

// socket
let socket = io()
//join
if(Order) {
    socket.emit('join', `Order_${Order._id}`)
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...Order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order Status Updated',
        progressBar: false,
    }).show();
})





let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}








