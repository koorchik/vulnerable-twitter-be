import express from 'express';
import controllers  from './controllers';

const router = express.Router();

const checkSession = controllers.sessions.check;

// Actions
router.post('/actions/:id', controllers.actions.submit);

// Sessions
router.post('/sessions', controllers.sessions.create);

// Contacts email
router.post('/contacts', controllers.contacts.send);

// Users
router.post('/users',               controllers.users.create);
router.post('/users/resetPassword', controllers.users.resetPassword);
router.post('/users/resetPasswordBySMS', controllers.users.resetPasswordBySMS);
router.get('/users/:id', controllers.users.show);
router.get('/users',     controllers.users.list);
router.put('/users/:id', checkSession, controllers.users.update);

// Images
router.post('/images', checkSession, controllers.images.create);

// Files
router.post('/files/upload', checkSession, controllers.files.upload);

// Tweets
router.post('/tweets',       checkSession, controllers.tweets.create);
router.delete('/tweets/:id', checkSession, controllers.tweets.delete);
router.get('/tweets',                      controllers.tweets.list);
router.get('/tweets/:id',                  controllers.tweets.show);
router.put('/tweets/:id',    checkSession, controllers.tweets.update);

export default router;
