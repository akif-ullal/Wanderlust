const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const fetch = require("node-fetch");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const axios = require("axios");

async function geocodeAddress(place) {
  try {
    const apiKey = process.env.OPENCAGE_KEY; // store key in .env
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}&limit=1`;

    const response = await axios.get(url);

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      console.warn("Location not found:", place);
      return null;
    }

    // Return the first result
    return {
      lat: response.data.results[0].geometry.lat,
      lon: response.data.results[0].geometry.lng
    };

  } catch (err) {
    console.error("OpenCage geocoding error:", err);
    return null;
  }
}

module.exports.renderNewForm=(req,res)=>{
  res.render("listing/new.ejs");
};

module.exports.index=async(req,res,next)=>{
  let listing = await Listing.find({});
  if(!listing)
  {
    next(new ExpressError(404,"page not found"));
  }
  res.render("listing/listing.ejs",{listing});
};

module.exports.addNewList = async (req, res, next) => {
  try {
    if (!req.body || !req.body.listing) {
      return next(new ExpressError(403, "Listing data missing"));
    }

    const place = req.body.listing.location;
    let geocodeResult = null;

    if (place) {
      geocodeResult = await geocodeAddress(place);
      if (!geocodeResult) {
        console.warn("Geocoding failed, using fallback coordinates");
        geocodeResult = { lat: 0, lon: 0 }; // fallback coordinates
      }
    } else {
      geocodeResult = { lat: 0, lon: 0 }; // fallback if no location provided
    }

    // Create new listing
    const list = new Listing(req.body.listing);
    list.owner = req.user._id;

    // Handle image upload
    if (req.file) {
      list.image = {
        filename: req.file.filename,
        url: req.file.path
      };
    }

    // Set geometry
    list.geometry = {
      type: "Point",
      coordinates: [Number(geocodeResult.lon), Number(geocodeResult.lat)]
    };

    await list.save();

    req.flash("success", "New listing added successfully");
    res.redirect("/listing");

  } catch (err) {
    console.error("Error in addNewList:", err);
    next(new ExpressError(500, "Something went wrong while adding listing"));
  }
};

module.exports.showList=async(req,res,next)=>{
  let {id} = req.params;
  let list = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }}).populate("owner");
  
  if(!list)
  {
    req.flash("error","List your requested is not available");
    return res.redirect("/listing");
  }
  res.render("listing/show.ejs",{list});
};

module.exports.renderUpdateForm=async(req,res,next)=>{
  
  let {id} = req.params;

  let list = await Listing.findById(id);

  if(!list)
  {
    req.flash("error","List your requested is not available");
    return res.redirect("/listing");
  }
  let orginalImage = list.image.url.replace("/upload", "/upload/h_300,w_250,q_auto:low");
  
  res.render("listing/edit.ejs",{list,orginalImage});
};

module.exports.updateList=async(req,res,next)=>{
  let {id} = req.params;

  let list = await Listing.findByIdAndUpdate(id,req.body.listing);

  if(typeof req.file!=="undefined")
  {
    let url=req.file.path;
    let filename=req.file.filename;

    list.image={filename,url};
    await list.save();
  }
  req.flash("success","List is updated");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyList=async(req,res,next)=>{
  let {id} = req.params;
  let list = await Listing.findByIdAndDelete(id);

  if(!list)
  {
    next(new ExpressError(404,"page not found"));
  }
  req.flash("success","List is deleted");
  res.redirect("/listing");
};


module.exports.searchList= async (req, res) => {
  const { q, minPrice, maxPrice } = req.query;

  let filter = {};

  // Text search
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ];
  }

  // Price range search
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const listing = await Listing.find(filter);
  res.render("listing/search", { listing, q });
};