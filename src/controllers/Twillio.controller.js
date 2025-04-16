  
import twilio from 'twilio';
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export const sendTwilioToken = async (req, res) => {
  const { identity, room } = req.body;

  if (!identity || !room) {
    return res.status(400).json({ message: 'Identity and Room are required' });
  }

  // Twilio credentials (store in .env)
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;

  // 1. Create a new access token
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity } // ✅ IMPORTANT: identity must be passed here
  );

  // 2. Grant access to Video
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);

  const token1 = token.toJwt();

  console.log("token is generated", token1);
  

  // 3. Return JWT token to frontend
  res.status(200).json({ token:  token1 });
};
