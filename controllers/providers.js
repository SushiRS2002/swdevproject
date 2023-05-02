const Provider = require("../models/Provider");

//@desc Get all providers.
//@route GET /api/v1/providers
//@access Public

exports.getProviders = async (req, res, next) => {
  /* let query;

  //req.query copying
  const reqQuery = { ...req.query };

  //Excluded Fields
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over remove fields and delete them for reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  //query string creation
  let queryStr = JSON.stringify(reqQuery);

  //Regex operators creation
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Resource finding
  query = Provider.find(JSON.parse(queryStr)).populate("appointments");

  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
 */
  try {
    const providers = await Provider.find();

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Get a single provider.
//@route GET /api/v1/providers/:id
//@access Public
exports.getProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Create a new Providers.
//@route POST /api/v1/providers
//@access Private
exports.createProvider = async (req, res, next) => {
  const provider = await Provider.create(req.body);
  res.status(201).json({ success: true, data: provider });
};

//@desc Update a provider.
//@route PUT /api/v1/providers/:id
//@access Private
exports.updateProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!provider) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: provider });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete a provider.
//@route DELETE /api/v1/providers/:id
//@access Private
exports.deleteProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(400).json({
        success: false,
      });
    }
    //provider.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
