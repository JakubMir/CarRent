import {auth} from "../config/firebase";
import {authService} from "../business/auth.service";



export function checkAuth(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    console.log(`token: ${token}`)
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    authService.verifyToken(token)
        .then(async (decodedToken) => {

            const userId = decodedToken.userId;

            try {
                const role = await authService.getUserRole(userId);

                res.locals.user = { ...decodedToken, role };

                next();
            } catch (error) {
                console.error('Error fetching user role:', error);
                return res.status(500).json({ error: 'Error retrieving user role' });
            }
        })
        .catch(error => {
            console.error('Error verifying token:', error);
            return res.status(401).json({ error: 'Unauthorized' });
        });
}

export function hasAnyRole(...roles: string[]) {
    return (req, res, next) => {
        const user = res.locals.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    };
}