const mongoose=require('mongoose')

const StorySchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim:true
    },
    body:{
        type: String,
        required: true
    },
    coverImage: {
        type: Buffer,
        required: false
      },
    coverImageType: {
    type: String,
    required: false
    },
    status:{
        type: String,
        default: 'public',
        enum:['public','private']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
})

StorySchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })

const Story=mongoose.model('Story',StorySchema);

module.exports=Story