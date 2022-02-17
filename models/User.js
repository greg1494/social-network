const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: 'Username is Required',
    },
    email: {
      type: String,
      unique: true,
      required: 'Email is Required',
      match: [/.+@.+\..+/]
    },
    userCreated: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
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
const User = model('User', UserSchema);

// export the User model
module.exports = User;