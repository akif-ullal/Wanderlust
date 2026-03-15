const express=require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const {isLoggedIn,isOwner,validationList} = require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/search",asyncWrap(listingController.searchList));

router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,validationList,upload.single('image'),asyncWrap(listingController.addNewList));


router.route("/:id")
.get(asyncWrap(listingController.showList))
.put(isLoggedIn,isOwner,validationList,upload.single('image'),asyncWrap(listingController.updateList))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyList));

router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.renderUpdateForm));

module.exports = router;