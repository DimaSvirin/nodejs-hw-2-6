import express from "express";
import contactController from '../../controllers/contact-controller.js'
import schema from '../../schema.js'
import {isValidId, isEmptyBody} from '../../middlewars/index.js'
import validateBody from "../../decorators/validateBody.js";

const contactsRouter = express.Router()

contactsRouter.get('/', contactController.getAll);

contactsRouter.get('/:contactId', isValidId, contactController.getOneById);

contactsRouter.post('/', isEmptyBody, validateBody(schema.contactAddSchema), contactController.addContact);

contactsRouter.put('/:contactId', isValidId, validateBody(schema.contactAddSchema), contactController.updateById);

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(schema.contactUpdateFavoriteScheme), contactController.updateField);

contactsRouter.delete('/:contactId', isValidId, contactController.deleteById);

export default contactsRouter