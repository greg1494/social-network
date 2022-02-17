const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent thought _id
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      max: 280
    },
    username: {
      type: String,
      required: 'Username is Required'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const ThoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    min: 1,
    max: 280
  },
  username: {
    type: String,
    required: 'Username is Required',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  reactions: [ReactionSchema]
}, 
{
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);


ThoughtSchema.virtual('reactionCount').get(function() {
    return this.comments.reduce((total, reactions) => total + reactions.replies.length + 1, 0);
  });

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;