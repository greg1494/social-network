const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true, 
      required: true,
      trim: true
    },
    userEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    // tells the schema that it can use virtuals
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.comments.reduce((total, friends) => total + friends.replies.length + 1, 0);
});

// create the User model using the UserSchema
const Pizza = model('User', UserSchema);

// export the User model
module.exports = User;