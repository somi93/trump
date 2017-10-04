const express = require('express');
const router = express.Router();

const Articles = require('./articles');


router.get('/get_articles', Articles.getArticles, Articles.sendJSON);
router.get('/get_articles/:id', Articles.getArticle, Articles.sendJSON);
router.put('/add_comment', Articles.addComment, Articles.sendJSON);
router.put('/add_reply', Articles.addReply, Articles.sendJSON);

router.get('/sources', Articles.getSources, Articles.sendJSON);

module.exports = router;
