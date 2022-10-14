
import React from 'react'
import "./transfer.css"
import {useEffect,useState,} from 'react'
import { PreTransferThunk,TransferThunk,selectPreTX, Reset} from '../../redux/auth/TXSlice'
import {Form,useNavigate} from "react-router-dom"
import {useDispatch,useSelector}  from "react-redux"
import {toast} from "react-toastify"


function Transfer() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [enable, SetEnable]= useState(false)
  const [TxData, SetTxData]= useState({
    "amount":"",
    "message":"",
    "name":"",
    "accountnumber":''
  })


 const checkValue =  function (e) {
  e.preventDefault()
    if (TxData.accountnumber.length<11) {
      SetTxData(prev=>({...prev,[e.target.name]: parseInt(e.target.value)}))
    }

    let userdata = {
      accountnumber: e.target.value
    }
 
  if (e.target.value.length ==11) {
      if(TxData.amount && TxData.message){  
       {TxData && dispatch(PreTransferThunk(userdata))}
      }
      SetEnable(prev=>(!prev))
    }
 }

 const checkOthers = function (e) {
  SetTxData(prev=>({...prev,[e.target.name]:e.target.value}))
  console.log(TxData);
 }

  const backFun = function (e) {
    e.preventDefault()
    SetTxData({
      "amount":"",
      "message":"",
      "accountnumber":""
    })
    SetEnable(prev=>(!prev))
  }

  const PreData = useSelector(selectPreTX)

  const MainTransfer = function (e) {
    e.preventDefault()
    dispatch(TransferThunk(TxData))
  }



  useEffect(()=>{
    dispatch(Reset())
  },[])

  useEffect(()=>{
    async function checkTransfer(){
      if (PreData.status == "Fulfilled") {
        toast.success(PreData.data,{position: toast.POSITION.TOP_CENTER})
        navigate("/dashbord") 
      }else if(PreData.error){
         
        let msg = await PreData.error;

        msg = msg.split(' ').splice(0,11).join(" ")

        toast.error(msg,{position: toast.POSITION.TOP_CENTER})
      } 
    } 
    checkTransfer()
  },[PreData])


  return (
    <div className='content-transter'>
        <div className='details'><button onClick={backFun}>Back</button>  <h4>Transter Form</h4> </div>
      <form action="">
          <input type="number" placeholder='Amount' onChange={checkOthers} name='amount' /> 
         { TxData.amount &&  <input type="text" placeholder='Message' onChange={checkOthers} name='message' /> }
       { TxData.message &&    <input type="number" placeholder='Account Number' disabled={enable && true} onChange={checkValue} name='accountnumber' />}
        {PreData.data.firstname && <input type="text" placeholder='Name' name='user' value={`${PreData.data?.firstname} ${PreData.data?.lastname}`} readOnly /> }

         {PreData.data?.firstname &&  <button type="button" onClick={MainTransfer}>Transfer </button>}
      </form>

  </div>
  )
}
// (preventDefault())
export default Transfer