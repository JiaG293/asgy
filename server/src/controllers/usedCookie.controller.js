const catchAsync = require('../middlewares/catchAsync.middleware');
const UsedCookie = require('../models/usedCookie.model');


const addCookieToUsedTokens = catchAsync(async (userId, cookie) => {
    try {
        let usedTokens = await UsedTokens.findOne({ userId });


        if (!usedTokens) {
            usedTokens = new UsedCookie({
                userId,
                tokens: [cookie],
            });

        } else {

            if (!usedTokens.tokens.includes(cookie.token))  {
                usedTokens.tokens.push(cookie);
            } else {

                console.log('Token already used');
                return;
            }
        }

        await UsedCookie.save();
        console.log('Token added to UsedCookie');
    } catch (error) {
        console.error('Error adding token to UsedCookie:', error);
    }
})

const removeExpiredCookie = catchAsync(async (userId) => {
    try {
 
        const usedTokens = await UsedTokens.findOne({ userId });

        if (!usedTokens) {
            return;
        }
        UsedCookie.tokens = usedTokens.tokens.filter((token) => {
            return token.expire > Date.now() - 24 * 60 * 60 * 1000; 
        });
        await UsedCookie.save();
        console.log('Expired tokens removed');
    } catch (error) {
        console.error('Error removing expired tokens:', error);
    }
})


module.exports = {
    addCookieToUsedTokens,
    removeExpiredCookie
}