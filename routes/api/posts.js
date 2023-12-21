import { log } from "console";

import { Router } from "express";

import Post from "../../model/Post.js";
import User from "../../model/User.js";


import auth from "../../middleware/auth.js";

const router = Router();

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name email avatar -_id"
    );

    const newPost = new Post({
      userId: req.userId,
      userName: user.name,
      userAvatar: user.avatar,
      postBody: req.body.postBody,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    log(err.message);
    res.status(500).send({ Error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    log(err.message);
    res.status(500).send({ Error: "Server error" });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ Error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.sendStatus(404);

    if (!post.userId.equals(req.userId)) return res.sendStatus(401);

    await post.deleteOne();
    res.status(200).json({ Success: "Post removed" });
    //res.status(500).send({ Error: 'Server error' });
  } catch (err) {
    log(err.message);
    res.status(500).send({ Error: "Server error" });
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some((like) => like.equals(req.userId)))
      return res.status(400).json({ Error: 'Post already liked' });

    post.likes.push(req.userId);
    await post.save();

    //res.sendStatus(200);
    //res.status(200).send(req.userId);
    res.json(post.likes);
  } catch (err) {
    res.status(500).send({ Error: 'Server error' });
  }
});
// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (!post.likes.some((like) => like.equals(req.userId)))
      return res.status(400).json({ Error: 'Post has not yet been liked' });

    post.likes = post.likes.filter((like) => !like.equals(req.userId));
    await post.save();
    //res.sendStatus(200);
    //res.status(200).send(req.userId);
    res.json(post.likes);
  } catch (err) {
    res.status(500).send({ Error: 'Server error' });
  }
});

router.post("/comment/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name avatar");
    const post = await Post.findById(req.params.id);

    const newComment = {
      userId: req.userId,
      userName: user.name,
      userAvatar: user.avatar,
      commentBody: req.body.commentBody,
    };

    //post.comments.unshift(newComment);
    post.comments.push(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).send({ Error: "Server error" });
  }
});
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find((comment) =>
      comment._id.equals(req.params.comment_id)
    );
   
    if (!comment)
      return res.status(404).json({ Error: "Comment does not exist" });
    // Check user
    if (!comment.userId.equals(req.userId))
      return res.status(401).json({ Error: "User not authorized" });

    post.comments = post.comments.filter(
      ({ _id }) => !_id.equals(req.params.comment_id)
    );

    await post.save();

    res.json(post.comments);
  } catch (err) {
    res.status(500).send({ Error: "Server error" });
  }
});

export default router;
