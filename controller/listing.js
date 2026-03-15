const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const fetch = require("node-fetch");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function geocodeAddress(place) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`;

    const response = await fetch(url);

    if(!response.ok){
      throw new ExpressError(500,"Geocoding API failed");
    }

    const data = await response.json();

    if(!data || data.length === 0){
      throw new ExpressError(400,"Location not found");
    }

    return data[0];

  } catch(err){
    throw new ExpressError(500,"Error while fetching location");
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

module.exports.addNewList=async(req,res,next)=>{
  
  // 3️⃣ Geocoding function
    const place = req.body.listing.location// must come from a POST form
    console.log(place);
    let newResponse = null;


    if (place) {
      // ✅ Call server-side geocoding
      newResponse = await geocodeAddress(place);
      console.log(newResponse);
      if (newResponse) {
        console.log("Latitude:", newResponse.lat);
        console.log("Longitude:", newResponse.lon);
      } else {
        console.log("Location not found");
      }
    }


  if(!req.body || !req.body.listing)
  {
    return next(new ExpressError(403,"page not found"));
  }

  console.log(req.file);
  let list = new Listing(req.body.listing);
  list.owner = req.user._id;
  
  let url=req.file.path;
  let filename=req.file.filename;

  list.geometry = {
  type: "Point",
  coordinates: [Number(newResponse.lon), Number(newResponse.lat)],
  };

  list.image={filename,url};
  await list.save();
  req.flash("success","new List is added");
  res.redirect("/listing");
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