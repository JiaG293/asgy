require('dotenv').config()
const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')

const {
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET,
    GOOGLE_MAILER_REFRESH_TOKEN,
    ADMIN_EMAIL_ADDRESS
} = process.env

const myOAuth2Client = new OAuth2Client(
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET
  )
  // Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
  })

 // Tạo API /email/send với method POST
 router.post('/email/send', async (req, res) => {
    try {
      // Lấy thông tin gửi lên từ client qua body
      const { email, subject, content } = req.body
      if (!email || !subject || !content) throw new Error('Please provide email, subject and content!')
      /**
       * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
       * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       */
      const myAccessTokenObject = await myOAuth2Client.getAccessToken()
    
      // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token
      // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: ADMIN_EMAIL_ADDRESS,
          clientId: GOOGLE_MAILER_CLIENT_ID,
          clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
          refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken
        }
      })
      // mailOption là những thông tin gửi từ phía client lên thông qua API
      const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: `<h3>${content}</h3>` // Nội dung email
      }
      // Gọi hành động gửi email
      await transport.sendMail(mailOptions)
      // Không có lỗi gì thì trả về success
      res.status(200).json({ message: 'Email sent successfully.' })
    } catch (error) {
      // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client
      console.log(error)
      res.status(500).json({ errors: error.message })
    }
  })
  
  

