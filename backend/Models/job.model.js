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
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'User',  
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
    },  
    requirements: {  
      type: [String],  
    },  
    createdAt: {  
      type: Date,  
      default: Date.now,  
    },  
    updatedAt: {  
      type: Date,  
      default: Date.now,  
    },  
    status: {  
      type: String,  
      enum: ['active', 'closed'],  
      default: 'active',  
    }  
  });  
  
  const Job = mongoose.model('Job', jobSchema);  
  export default Job;