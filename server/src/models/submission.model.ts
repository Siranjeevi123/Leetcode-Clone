import mongoose, { Schema } from "mongoose";
const SubmissionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'Problem',
        required:"true"
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','cpp','java']
    },
    status:{
        typed:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'

    },
    runtime:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    }
},{timestamps:true});

const Submission = mongoose.model('submission',SubmissionSchema);

export default Submission;