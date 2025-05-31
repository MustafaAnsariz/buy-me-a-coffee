import {NextResponse} from 'next/server';
import Razorpay from 'razorpay';
import Payment from '@/models/Payment'; 
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import mongoose from 'mongoose';
import User from '@/models/User';


export async function POST(request) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB IN Razorpay");
    // get the body
    let body = await request.formData();

    body = Object.fromEntries(body);

   
    // check if razorpayorderid is present

    let p = await Payment.findOne({oid: body.razorpay_order_id});
    if (!p) {
        return NextResponse.json({message: "OrderId not found"}, {status: 404});
    }

    // fetch the secret of user whose making the payment
    const user = await User.findOne({username: p.to_user});
    const secret = user.RazorpaySecret;

    // verify the payment
    let xx = validatePaymentVerification({ "order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id }, body.razorpay_signature, secret);

    if (xx) {
        // update the payment status
        const UpdatedPayment = await Payment.findOneAndUpdate({oid: body.razorpay_order_id}, {done: true}, {new: true});

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${UpdatedPayment.to_user}?paymentdone=true`, {status: 302});
    } 
    else {
        return NextResponse.json({message: "Payment verification failed"}, {status: 400});
    }
}