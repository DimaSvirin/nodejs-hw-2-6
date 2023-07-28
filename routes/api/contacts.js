import express from "express"
import Contact from "../../models/contact.js";
import { HttpError } from '../../helpers/index.js';
import schema from '../../schema.js'
import {isValidId, isEmptyBody} from '../../middlewars/index.js'
import validateBody from "../../decorators/validateBody.js";

const contactsRouter = express.Router()

contactsRouter.get('/', async (req, res, next) => {
  try {
  const result = await Contact.find();
  res.json(result);    
  } catch (error) {
    res.status(500).json({message: "Server error",})
  }

})

contactsRouter.get('/:contactId', isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, `Contacts with id=${contactId} not found`)
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
})


contactsRouter.post('/', isEmptyBody, validateBody(schema.contactScheme), async (req, res, next) => {
  try {
    const { error } = schema.contactScheme.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
      const result = await Contact.create(req.body);
      res.status(201).json(result);
  } catch (error) {
        next(error);
  }
})

contactsRouter.put('/:contactId', isValidId, validateBody(schema.contactScheme), async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true })
  if (!result) {
    throw HttpError(400, `Contact with id=${contactId} not found`);
  }
  res.json(result);
});

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(schema.contactUpdateFavoriteScheme), async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
});


contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw new Error(404, `Contacts with id=${contactId} not found`)
    }
    res.json({
    message: "Contact deleted"
  })  
  } catch (error) {
      next(error);
  }
})

export default contactsRouter