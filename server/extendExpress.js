import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import cookieParser from 'cookie-parser';
import LocalStrategy from 'passport-local'
import uuid from 'uuid'

const authorizationSecret = 'auth-secret'

const cookieMiddleware = cookieParser()

export default (express) => {
    express.use(passport.initialize());
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'name',
                passwordField: 'password',
                passReqToCallback: true,
                session: false,
            },
            function(req, name, password, done) {
                const passwordHash = crypto
                    .createHmac('sha256', authorizationSecret)
                    .update(password)
                    .digest('hex');
                return done(null, {
                    name,
                    passwordHash,
                });
            },
        )
    );

    express.use('/api/commands/', cookieMiddleware, authorizationMiddleware);

    express.get('/auth', cookieMiddleware, passport.authenticate('local', { failureRedirect: '/unauthorized' }), async (req, res) => {
        const users = await req.resolve.executeQuery('users');

        let user;
        for(let id in users) {
            if(
                (users[id].name === req.user.name) &&
                (users[id].passwordHash === req.user.passwordHash)
            ) {
                user = users[id];
                break;
            }
        }
        if(!user) {
            user = {
                ...req.user,
                id: uuid.v4()
            };
            try {
                await req.resolve.executeCommand({
                    type: 'createUser',
                    aggregateId: user.id,
                    aggregateName: 'users',
                    payload: user
                });
            } catch (error) {
                console.log(error);
                res.redirect(`/error/?text=${error.toString()}`);
                return;
            }
        }

        try {
            const authorizationToken = jwt.sign(user, authorizationSecret, {
                noTimestamp: true,
            });

            res.cookie('authorizationToken', authorizationToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365
            });

            res.redirect(req.query.redirect || '/');
        } catch (error) {
            res.redirect('/unauthorized/');
        }
    })
}

export function accessDenied(req, res) {
    res.status(401).send('401 Unauthorized');
}

export function authorizationMiddleware(req, res, next) {
    try {
        const user = jwt.verify(req.cookies.authorizationToken, authorizationSecret);
        if(!user) {
            throw new Error('Unauthorized');
        }
        req.body.user = user;
        next();
    } catch (error) {
        accessDenied(req, res);
    }
}

