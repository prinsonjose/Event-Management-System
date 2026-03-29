const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth, authorize } = require('../middleware/auth');
const { Parser } = require('json2csv');

const router = express.Router();

// @route   POST /api/registrations/:eventId
// @desc    Student registers for an event
router.post('/:eventId', auth, authorize('student'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('registrationCount');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event date has passed
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      event: event._id,
      student: req.user._id,
    });
    if (existingReg) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // Check participant limit
    const currentCount = await Registration.countDocuments({ event: event._id });
    if (currentCount >= event.maxParticipants) {
      return res.status(400).json({ message: 'This event has reached its maximum number of participants' });
    }

    const registration = await Registration.create({
      event: event._id,
      student: req.user._id,
    });

    res.status(201).json({ registration, message: 'Successfully registered for the event!' });
  } catch (error) {
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }
    next(error);
  }
});

// @route   GET /api/registrations/my
// @desc    Get student's registered events
router.get('/my', auth, authorize('student'), async (req, res, next) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate({
        path: 'event',
        populate: {
          path: 'createdBy',
          select: 'name email phone college department',
        },
      })
      .sort({ registeredAt: -1 });

    res.json({ registrations });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/registrations/:eventId
// @desc    Student cancels registration
router.delete('/:eventId', auth, authorize('student'), async (req, res, next) => {
  try {
    const registration = await Registration.findOneAndDelete({
      event: req.params.eventId,
      student: req.user._id,
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Admin views participants of their event
router.get('/event/:eventId', auth, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view participants of your own events' });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email college course year semester phone')
      .sort({ registeredAt: -1 });

    res.json({ registrations, event });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/registrations/event/:eventId/export
// @desc    Admin exports participants as CSV
router.get('/event/:eventId/export', auth, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email college course year semester phone')
      .sort({ registeredAt: -1 });

    const data = registrations.map((r, index) => ({
      'S.No': index + 1,
      Name: r.student.name,
      Email: r.student.email,
      Phone: r.student.phone || 'N/A',
      College: r.student.college || 'N/A',
      Course: r.student.course || 'N/A',
      Year: r.student.year || 'N/A',
      Semester: r.student.semester || 'N/A',
      'Registered At': new Date(r.registeredAt).toLocaleString(),
    }));

    const fields = ['S.No', 'Name', 'Email', 'Phone', 'College', 'Course', 'Year', 'Semester', 'Registered At'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data.length ? data : [{}]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_participants.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
