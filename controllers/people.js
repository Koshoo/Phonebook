const peopleRouter = require('express').Router();
const Person = require('../models/person');

peopleRouter.get('/info', (req, res) => {
  Person.find({}).then((people) => {
    res.send(
      `Phonebook has info for ${people.length} people <br/> ${new Date()}`
    );
  });
});

peopleRouter.get('/', async (req, res) => {
  const people = await Person.find({});
  res.json(people.map((person) => person.toJSON()));
});

peopleRouter.post('/', (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'name is missing'
    });
  } else if (!req.body.number) {
    return res.status(400).json({ error: 'number is missing' });
  }
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => res.json(savedAndFormattedPerson))
    .catch((err) => next(err));
});

peopleRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        res.status(404).end();
      }
      res.json(person.toJSON());
    })
    .catch((err) => next(err));
});

peopleRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

peopleRouter.put('/:id', (req, res, next) => {
  const person = { name: req.body.name, number: req.body.number };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((updatedPerson) => updatedPerson.toJSON())
    .then((formattedAndUpdatedPerson) => res.json(formattedAndUpdatedPerson))
    .catch((err) => next(err));
});

module.exports = peopleRouter;
