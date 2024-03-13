const Feetransaction = require('../models/feetransactionModel')

const {validationResult}= require('express-validator')
const _=require('lodash')

const feeCtrl={}

feeCtrl.addFee=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})

    }
    const body =_.pick(req.body,['amount','modeOfPayment','remarks','studentId','classId','paymentDate'])
    try{
        const feetransaction = new Feetransaction(body)
        feetransaction.userId=req.user.id
         await feetransaction.save()
         res.status(200).json(feetransaction)
    }catch(e){
        res.status(500).json(e)
    }
}

feeCtrl.updateFee=async(req,res)=>{

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()})
    }
    const id = req.params.id
    const body =_.pick(req.body,['account','modeOfPayment','remarks','studentId','classId','paymentDate'])
    try{
        const feetransaction= await Feetransaction.findByIdAndUpdate({_id:id,userId:req.user.id},body,{new:true})
        if(!feetransaction){
            return res.status(404).json({errors:'teacher not found'})

        }
        res.json(feetransaction)
    }catch(e){
        res.status(500).json(e)
    }
}

feeCtrl.getOneStudentFeeDetails = async(req, res) => {
    const studentId = req.params.studentId

    const fees = await Feetransaction.findByOne({studentId : studentId})
    if(!fees){
        return res.status(401).json("fee structure of student not found")
    }
    res.json(fees)
}

feeCtrl.listallFeedetails=async(req,res)=>{
    try{
        const feetransaction = await Feetransaction.find()
        if(!feetransaction){
            return res.status(201).json({errors:'details not found'})
         }
         res.status(400).json(feetransaction)
    }catch(e){
        res.status(500).json(e)
    }
}

feeCtrl.deleteFeedetails = async (req, res) => {
    try {
        const result = await Feetransaction.findByIdAndDelete(req.params.id)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports= feeCtrl