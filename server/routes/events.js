const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get events - admin sees own events, student sees all
router.get('/', auth, async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query.createdBy = req.user._id;
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email phone college department')
      .populate('registrationCount')
      .sort({ date: 1 });

    res.json({ events });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/events/:id
// @desc    Get single event with details
router.get('/:id', auth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email phone college department')
      .populate('registrationCount');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if current student is registered
    let isRegistered = false;
    if (req.user.role === 'student') {
      const reg = await Registration.findOne({
        event: event._id,
        student: req.user._id,
      });
      isRegistered = !!reg;
    }

    res.json({ event, isRegistered });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/events
// @desc    Create event (admin only)
router.post(
  '/',
  auth,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Event name is required'),
    body('date').notEmpty().withMessage('Event date is required'),
    body('time').trim().notEmpty().withMessage('Event time is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('maxParticipants')
      .isInt({ min: 1 })
      .withMessage('Max participants must be at least 1'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
      }

      const event = await Event.create({
        ...req.body,
        createdBy: req.user._id,
      });

      const populated = await Event.findById(event._id)
        .populate('createdBy', 'name email phone college department')
        .populate('registrationCount');

      res.status(201).json({ event: populated, message: 'Event created successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update event (admin only, own events)
router.put('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own events' });
    }

    const allowedFields = ['name', 'date', 'time', 'venue', 'description', 'maxParticipants'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email phone college department')
      .populate('registrationCount');

    res.json({ event: updatedEvent, message: 'Event updated successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (admin only, own events)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own events' });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
