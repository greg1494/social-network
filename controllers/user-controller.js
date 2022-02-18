const { User, Thought } = require('../models');


const userController = {
    // get all users
    getAllUsers(req, res) {
      User.find({})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get one user by id
    getUserById({ params }, res) {
      User.findOne({ _id: params.id })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    // createUser
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params }, res) {
      // delete the user
      User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id'});
              return;
          }
          // remove the user from any friends arrays
          User.updateMany(
              { _id : {$in: dbUserData.friends } },
              { $pull: { friends: params.id } }
          )
          .then(() => {
              // remove any comments from this user
              Thought.deleteMany({ username : dbUserData.username })
              .then(() => {
                  res.json({message: "Successfully deleted user"});
              })
              .catch(err => res.status(400).json(err));
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  },


  addFriend({ params }, res) {
    // add friendId to userId's friend list
    User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this userId' });
            return;
        }
        // add userId to friendId's friend list
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $addToSet: { friends: params.userId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData2 => {
            if(!dbUserData2) {
                res.status(404).json({ message: 'No user found with this friendId' })
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
  },


  deleteFriend({ params }, res) {
      // remove friendId from userId's friend list
      User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true, runValidators: true }
      )
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this userId' });
              return;
          }
          // remove userId from friendId's friend list
          User.findOneAndUpdate(
              { _id: params.friendId },
              { $pull: { friends: params.userId } },
              { new: true, runValidators: true }
          )
          .then(dbUserData2 => {
              if(!dbUserData2) {
                  res.status(404).json({ message: 'No user found with this friendId' })
                  return;
              }
              res.json({message: 'Successfully deleted the friend'});
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
}



module.exports = userController;