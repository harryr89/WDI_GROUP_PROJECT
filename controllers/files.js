const File = require('../models/file');
// const User = require('../models/user');
const Watson = require('../lib/watson');

function filesIndex (req, res, next){
  File
    .find()
    .exec()
    .then(files => res.status(200).json(files))
    .catch(next);
}

function filesNew (req, res, next){
  Watson(req)
    .then(result => {
      return File.create({
        filename: req.body.filename,
        createdBy: req.body.createdBy,
        html: req.body.html,
        audio: result
      });
    })
    .then((file) => {
      return res.status(201).json(file);
    })
    .catch(next);
}

function filesShow (req, res, next){
  File
    .findById(req.params.id)
    .populate('comments.createdBy')
    .exec()
    .then(file => {
      if (!file) return res.status(200).json({ message: 'file not found'});
      return res.status(200).json(file);
    })
    .catch(next);
}

function filesUpdate(req, res, next){
  File
    .findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(file => {
      if (!file) return res.status(404).json({ message: 'file not found '});
      return res.status(200).json(file);
    })
    .catch(next);
}

function filesDelete(req, res, next){
  File
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(file => {
      if (!file) return res.status(404).json({ message: 'file not found'});
      return res.sendStatus(204);
    })
    .catch(next);
}

function commentsCreate(req, res, next) {

  File
    .findById(req.params.id)
    .exec()
    .then(file => {
      if(!file) return res.notFound();
      req.body.createdBy = req.user.userId;
      file.comments.push(req.body);
      file.save();
      return res.status(200).json({ file });
    })
    .catch(next);
}

function commentsDelete(req, res, next){
  File
    .findById(req.params.id)
    .exec()
    .then(file => {
      if (!file) return res.notFound();
      const comment = file.comments.id(req.params.commentId);
      comment.remove();
      file.save();
      return res.status(200).json({message: 'comment was successfully deleted'});
    })
    .catch(next);
}

module.exports = {
  index: filesIndex,
  new: filesNew,
  show: filesShow,
  update: filesUpdate,
  delete: filesDelete,
  createComment: commentsCreate,
  deleteComment: commentsDelete
};
