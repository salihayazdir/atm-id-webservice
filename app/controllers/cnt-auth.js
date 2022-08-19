import { config } from 'dotenv';
import { Queries } from '../queries/queries-auth.js';
import bcrypt from 'bcrypt';
import {SMTPClient} from 'emailjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto'

config();

const postRegister = async (req, res) => {
    const { email } = req.body;
  
    const users = await Queries.Users.Get.ByEmail(email);
    
      if (users.length === 0) {
        await Queries.Users.Create(email)
          .catch(err => res.json(res.json( {success:false, message: `Kullanıcı oluşturulamadı. ${err}` } )));
    }

    res.json( {success: true, message: `Kayıt oluşturuldu.`} )
  }

// check email format with regex

const { MAIL_USER, MAIL_HOST, MAIL_PW } = process.env

const client = new SMTPClient({
    user: MAIL_USER,
    password: MAIL_PW,
    host: MAIL_HOST,
    ssl: true,
  });

const sendEmail = async (to, subject, data) => {
  try {
    await client.sendAsync({
      from: MAIL_USER,
      to,
      subject,
      attachment: [{ data, alternative: true }],
    });
  } catch (err) {
    return 'E-posta gönderilemedi.'
  }
};

const postLogin = async (req, res) => {
    try {
      const { email } = req.body;

      const users = await Queries.Users.Get.ByEmail(email);
      if (users.length === 0) throw "Kullanıcı bulunamadı.";
      const user = users[0];

      const code = crypto.randomBytes(256).toString("hex").slice(0, 6).toUpperCase();
      const encrypted_code = bcrypt.hashSync(code, 10);

      await Queries.Otp.Delete.ByUserId(user.id);
      await Queries.Otp.Create(user.id, encrypted_code);

      await sendEmail(email, "Doğrulama Kodu", `Tek kullanımlık kodunuz: ${code}`)
        .catch(err => res.json(res.json( {success:false, message: `Kullanıcı oluşturulamadı. ${err}` } )));

      res.json({
        success: true,
        message: `Tek kullanımlık doğrulama kodu ${email} adresine gönderildi.` ,
        code: code,
        user: {
          id: user.id,
          memberno: user.memberno,
          email: user.email,
          name: user.name,
        }
      })
    } catch (err) {
      return res.json( {success:false, message: err } )
    }
  };

const makeToken = (data) => {
  const expirationDate = new Date();
  expirationDate.setMinutes(new Date().getMinutes() + 5);
  return jwt.sign({ ...data, expirationDate }, process.env.JWT_SECRET_KEY);
};

const postToken = async (req, res) => {
    try {
      const { email, code } = req.body;
  
      const users = await Queries.Users.Get.ByEmail(email);
      if (users.length === 0) throw "Kullanıcı bulunamadı.";
      const user = users[0];

      const otps = await Queries.Otp.Get.ByUserId(user.id);
      
      if (otps.length === 0) throw "Tek kullanımlık şifrenizin süresi dolmuştur.";

      const otp = otps[0];
      if (Date.parse(otp.created_at) + 1000 * 60 * 5 < Date.now()) throw "Tek kullanımlık şifrenizin süresi dolmuştur.";
      
      const match = bcrypt.compareSync(code, otp.code);
      if (!match) throw "Kod doğrulanamadı.";
    
      await Queries.Otp.Delete.ByUserId(user.id);

      const token = makeToken({ ...user, });

      // res.cookie("access_token2", token, {
      //   secure: process.env.NODE_ENV !== "development",
      //   httpOnly: true
      // });

      return res.json({
        success: true,
        message: 'Kod doğrulandı.Token Oluşturuldu.',
        token_type: 'Bearer',
        access_token: token,
        scope: 'atm_read atm_write',
        expires_in: '3600',
        user: {
          id: user.id,
          memberno: user.memberno,
          email: user.email,
          name: user.name,
        }
      })

    } catch (err) {
      return res.json( {success:false, message: `Kod doğrulanamadı. ${err}` } )
    }
}


const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  try {
    if (!token) throw 'Token bulunamadı.';
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!data.expirationDate || (Date.parse(data.expirationDate) < Date.now())) throw 'Token geçerliliğini yitirdi.';
    req.user = {};
    Object.keys(data).forEach((key) => {
    req.user[key] = data[key];
    });
    res.locals.data = data
    return next();
  } catch (err) {
      return res.json({success: false, message: `Token doğrulanamadı. ${err}`});
  }
};

const postAccount = async (req, res) => {
  const userData = res.locals.data
  res.json({
    success: true,
    user: {...userData}
  });
}

export {
    postRegister,
    postLogin,
    postToken,
    postAccount,
    validateToken
}