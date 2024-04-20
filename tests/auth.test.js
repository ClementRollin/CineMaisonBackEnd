const { createUser, findUserByUsername, setupAccount, login } = require('../src/models/userModel');
const bcrypt = require('bcrypt');

describe("Auth Tests", () => {
    describe("Unit Tests", () => {
        test('createUser - Should insert user into the database', async () => {
            const username = 'testuser';
            const password = 'testpassword';
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await createUser(username, hashedPassword);
            expect(result).toBeTruthy();
        });

        test('findUserByUsername - Should retrieve user by username', async () => {
            const username = 'testuser';
            const user = await findUserByUsername(username);
            expect(user.username).toBe(username);
        });

        test('setupAccount - Should create account if passwords match', async () => {
            const username = 'testuser2';
            const password = 'testpassword2';
            const confirmPassword = 'testpassword2';
            if (password === confirmPassword) {
                const user = await setupAccount(username, password);
                expect(user).toBeTruthy();
            }
        });
    
        test('login - Should authenticate user if password is correct', async () => {
            const username = 'testuser';
            const password = 'testpassword';
            const user = await login(username, password);
            expect(user).toBeTruthy();
        });
    
        describe("Integration Tests", () => {
            test('Setup Account and Login - Should register and login user', async () => {
                const username = 'testuser3';
                const password = 'testpassword3';
                const confirmPassword = 'testpassword3';
                if (password === confirmPassword) {
                    const user = await setupAccount(username, password);
                    const loggedInUser = await login(username, password);
                    expect(loggedInUser).toBeTruthy();
                }
            });
        });
    
        describe("Functional Tests", () => {
            test('Full Authentication Flow - Should register, then log in user successfully', async () => {
                const username = 'testuser4';
                const password = 'testpassword4';
                const confirmPassword = 'testpassword4';
                if (password === confirmPassword) {
                    const user = await setupAccount(username, password);
                    const loggedInUser = await login(username, password);
                    expect(loggedInUser).toBeTruthy();
                }
            });
        });
    });
});