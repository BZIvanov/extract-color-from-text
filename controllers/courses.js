const Course = require('../models/course');
const Bootcamp = require('../models/bootcamp');
const Filters = require('../utils/filters');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getCourses = catchAsync(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    filtered = new Filters(
      Course.find().populate({
        path: 'bootcamp',
        select: 'name description',
      }),
      req.query
    )
      .filter()
      .select()
      .sort()
      .paginate();

    query = filtered.docs;
  }

  const courses = await query;

  res
    .status(200)
    .json({ success: true, results: courses.length, data: courses });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new AppError(`Course with id: ${req.params.id} not found.`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

exports.addCourse = catchAsync(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new AppError(`Bootcamp with id: ${req.params.bootcampId} not found.`, 404)
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new AppError(`Course with id: ${req.params.id} not found.`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new AppError(`Course with id: ${req.params.id} not found.`, 404)
    );
  }

  await course.remove();

  res.status(200).json({ success: true, data: null });
});