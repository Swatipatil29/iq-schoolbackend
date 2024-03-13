const Feetransaction = require("../models/feetransactionModel")

const paymentCtrl = {}
const stripe = require("stripe")("sk_test_51OhWcnSBorkZ8Ic3uyKbnijwc9OzCgtifgxSfvXP8YItyx6rHA2AcswwJadypIsTvp0Md4V0SDqFLPURIgZoozmc00PUeBM3KC")


paymentCtrl.checkout = async (req,res) =>{
    const {amount,studentid,classid,name} = req.body

    const lineItems = [{
        price_data : {
            currency : "inr",
            product_data : {
                name : "Fees"
            },
            unit_amount : amount * 100
        },
        quantity : 1
    }]

    const customer = await stripe.customers.create({
        name: name,
        address: {
            line1: 'India',
            postal_code: '560004',
            city: 'Bengaluru',
            state: 'KA',
            country: 'US', 
        },
    })

    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            line_items : lineItems,
            mode : "payment",
            success_url : "http://localhost:3000/success",
            cancel_url : "http://localhost:3000/failure",
            customer : customer.id
        })
        //sending session id and url to frontend
        res.json({id : session.id , url : session.url })

        const feeTransaction = new Feetransaction({
            amount : amount,
            modeOfPayment : "online",
            studentId : studentid,
            classId : classid,
            paymentDate : new Date(),
            transactionId : session.id
        })
        await feeTransaction.save()

    }catch(e){
        res.status(500).json(e)
    }
}

paymentCtrl.updatePayment = async (req,res) =>{
    const id = req.body.transactionId
    try{
        const feeTransaction =  await Feetransaction.findOneAndUpdate({transactionId : id},{status : "success"})
        res.status(200).json(feeTransaction)
    }catch(e){
        res.status(500).json(e)
    }
}

paymentCtrl.getAllStudentFeeDetails = async (req, res) => {
    try {
        const feedetails = await Feetransaction.find();
        res.status(200).json(feedetails); // Corrected the response status and removed the duplicate json() method call
    } catch (e) {
        console.log(e)
        res.status(500).json(e);
    }
}

paymentCtrl.deletePayment = async (req,res) =>{
    const id = req.params.id
    // console.log(id,"idddd")
    try{
        const feeTransaction =  await Feetransaction.findOneAndDelete({transactionId : id})
        res.status(200).json(feeTransaction)
        
    }catch(e){
        res.status(500).json(e)
    }
}

paymentCtrl.details = async (req,res) =>{
    const classid = req.params.classid
    const studentid = req.params.studentid
    
    try{
        const feeTransaction =  await Feetransaction.findOne({studentId : studentid ,classId : classid , status : "success"})
        if(!feeTransaction){
            return res.status(200).json({})
        }
        res.status(200).json(feeTransaction)

        // console.log(feeTransaction)
    }catch(e){
        res.status(500).json(e)
    }

}

//total fee calculation
paymentCtrl.totalFee = async (req,res) =>{
    
    try{
        const totalFeeTransactions = await Feetransaction.find({status : "success"})
        const totalFee = totalFeeTransactions.reduce((acc,cv)=>{
            return acc += cv.amount
        },0)
        res.status(200).json({totalFee : totalFee})
        
    }catch(e){
        res.status(500).json(e)
    }

}

paymentCtrl.getOneStudentPayment = async(req, res) => {
    const studentId = req.params.studentId
    try {
      const feedetails = await Feetransaction.find({ studentId });
      if(!feedetails){
         return  res.json("student Not found")
      }
      res.json(feedetails)
    } catch(e){
        console.log(e)
        res.json(e)
    }
}


module.exports = paymentCtrl