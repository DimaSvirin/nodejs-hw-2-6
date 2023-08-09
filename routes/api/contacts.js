import express from "express";
import contactsServices from '../../models/contacts.js';
import { HttpError } from '../../helpers/index.js';
import contactScheme from '../../schema.js';

const contactsRouter = express.Router()

contactsRouter.get('/', async (req, res, next) => {
  try {
  const result = await contactsServices.listContacts();
  res.json(result);    
  } catch (error) {
    res.status(500).json({message: "Server error",})
  }

})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    console.log(req.params);
    const { contactId } = req.params;
    const result = await contactsServices.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contacts with id=${contactId} not found`)
}
    res.json(result);
  } catch (error) {
    next(error);
  }
  
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactScheme.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
      const result = await contactsServices.addContact(req.body);
      res.status(201).json(result);
  } catch (error) {
        next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsServices.removeContact(contactId);
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

contactsRouter.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactScheme.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
  const { contactId } = req.params;
  const result = await contactsServices.updateContactById(contactId, req.body);
  if (!result) {
    throw new Error(404, `Contacts with id=${contactId} not found`)
  }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
  })

export default contactsRouter