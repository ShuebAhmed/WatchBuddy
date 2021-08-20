// imporing dependencies
const router = require('express').Router();
const userManager = require('../managers/user');
const { uuid } = require('uuidv4');
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// login route
// a POST request for /users/login will be handled here
router.post('/login', async (req, res) => {
    try {
        // first check if the user exists
        let user = await userManager.getByEmail(req.body.email);
        if(!user)
            return res.status(400).send(`User does not exists with this email.`);

        // check if the password is correct
        const passwordMatches = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatches)
            return res.status(400).send(`Password did not match.`);

        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// route for signup
router.post('/signup', async (req, res) => {
    try {
        // first check if the user with this email already exists
        let user = await userManager.getByEmail(req.body.email);
        if (user)
            return res.status(400).send(`User already exists with this email.`);
            
        const obj = {
            ...req.body,
            password: await bcrypt.hash(req.body.password, SALT_ROUNDS)
        };

        // create new database user
        user = await userManager.create(obj);
        // return newly created user record with the response
        return res.status(200).send(user);
    } catch (ex) {
        // send errors in case of any exceptions
        return res.status(500).send(ex.message);
    }
});

// update password
router.post('/up/:id', async (req, res) => {
    try {
        const t = await userManager.updatePassword(req.params.id, { ...req.body });
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// update profile
router.post('/ua/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        // if user has updated his profile picture
        if (req.files && req.files.file) {
            let targetFile = req.files.file;
            const ext = path.extname(targetFile.name);
            // create unique name for this file
            const key = `${uuid()}${ext}`;
            // save that file in "uploads" folder with a unique name
            targetFile.mv(path.join(__dirname, '../uploads', key), async err => {
                let data = {
                    ...req.body,
                    pictureId: key
                }
                // update user data
                const t = await userManager.updateProfile(userId, data);
                // return updated data to the response
                return res.status(200).send(t);
            });
        } else {
            // if there is no file attached
            // then no need to save it, rest of the process is same as above
            let user = await userManager.getById(userId);
            let data = {
                ...req.body,
                pictureId: user.pictureId
            }
            const t = await userManager.updateProfile(userId, data);
            return res.status(200).send(t);
        }
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get list of all the users
router.post('/', async (req, res) => {
    try {
        const t = await userManager.list(req.body.keyword || '');
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get matching users
router.post('/matching/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userManager.getById(userId);
        const users = await userManager.matching(user);
        return res.status(200).send(users);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get a specific user by its ID
router.get('/:id', async (req, res) => {
    try {
        const t = await userManager.getById(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// delete a specific user by its ID
router.delete('/:id', async (req, res) => {
    try {
        const t = await userManager.deleteById(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// add moveis for a user
router.post('/add-movie/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const t = await userManager.updateMovies(userId, req.body.movies);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// add movies in panned list of a user
router.post('/add-planned/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const t = await userManager.updatePlanned(userId, req.body.planned);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;