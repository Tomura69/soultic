import { MailOptions } from 'nodemailer/lib/json-transport';

export const forgotPasswordTemplate = (
  uuid: string,
  email: string
): MailOptions => {
  const url = `${process.env.FRONTEND_URL}${process.env.FORGOT_PASSWORD_URL}/${uuid}`;
  return {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: 'Forgot-password confirmation', // Subject line
    text: 'Hello world?', // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  };
};
