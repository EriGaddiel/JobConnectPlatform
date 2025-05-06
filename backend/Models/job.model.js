import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({  
    title: {  
      type: String,  
      required: true,  
    },  
    description: {  
      type: String,  
      required: true,  
    },  
    company: {  
      type: String,    
      required: true,  
    },  
    location: {  
      type: String,  
    },  
    salary: {  
      type: String,   
    },  
    employmentType: {  
      type: String,  
      enum: ['full-time', 'part-time', 'freelance', 'contract'],  
      required: true,  
      default: "full-time"
    },  
    requirements: {  
      type: [String],  
    },  
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',   
    }, 
    status: {  
      type: String,  
      enum: ['open', 'close'],  
      default: 'open',  
    }  
  },{timestamps: true});  
  
  const Job = mongoose.model('Job', jobSchema);  
  export default Job;