const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const moment = require('moment');
const sendgrid = require('@sendgrid/mail');
const fs = require("fs");
const path = require('path');

const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
var multer = require('multer');
const { isAdmin } = require('../../middleware/isAdmin');
var cloudinary = require('cloudinary');
const config = require('config');

sendgrid.setApiKey(config.get('sendgrid_api'));

// cloundinary configuration
cloudinary.config({
  cloud_name: config.get('cloud_name'),
  api_key: config.get('api_key'),
  api_secret: config.get('api_secret'),
});

// multer configuration
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are accepted!'), false);
  }
  cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

// @route   POST /api/users/add
// @desc    Add new user
// @access  Private

router.post(
  '/add',
  upload.single('avatar'),
  // isAdmin,
  [
    check('username', 'User Name is Required').not().isEmpty(),
    check('fullname', 'Full Name is Required').not().isEmpty(),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('contactnumber', 'Please Enter Contact Number').not().isEmpty(),
    check('gender', 'Please select your Gender').not().isEmpty(),
    check(
      'password',
      'Please Enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      let body = JSON.parse(JSON.stringify(req.body));

      var sections;
      if (req.body.sections) {
        sections = req.body.sections.split(',');
      }
      // check if there is any record with same email and username
      const userByEmail = await User.findOne({ email: body.email });
      const userByUsername = await User.findOne({ username: body.username });

      if (userByEmail) {
        return res
          .status(422)
          .json({ errors: [{ msg: 'User with this Email already exists' }] });
      }
      if (userByUsername) {
        return res.status(500).json({
          errors: [{ msg: 'User with this Username already exists' }],
        });
      }

      // save user record
      // const { avatar } = file.path;
      let avatar = gravatar.url(body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      let userBody;
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);
      //Dont remove these 4 variables, they are used in email template
      const uname= body.username;  //1
      const tempPass = body.password;  //2
      const fullName = body.fullname;  //3
      const emailTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
       <head> 
        <meta charset="UTF-8"> 
        <meta content="width=device-width, initial-scale=1" name="viewport"> 
        <meta name="x-apple-disable-message-reformatting"> 
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <meta content="telephone=no" name="format-detection"> 
        <title>New email</title> 
        <!--[if (mso 16)]>
          <style type="text/css">
          a {text-decoration: none;}
          </style>
          <![endif]--> 
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
        <!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]--> 
        <!--[if !mso]><!-- --> 
        <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet"> 
        <!--<![endif]--> 
        <style type="text/css">
      #outlook a {
        padding:0;
      }
      .ExternalClass {
        width:100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height:100%;
      }
      .es-button {
        mso-style-priority:100!important;
        text-decoration:none!important;
      }
      a[x-apple-data-detectors] {
        color:inherit!important;
        text-decoration:none!important;
        font-size:inherit!important;
        font-family:inherit!important;
        font-weight:inherit!important;
        line-height:inherit!important;
      }
      .es-desk-hidden {
        display:none;
        float:left;
        overflow:hidden;
        width:0;
        max-height:0;
        line-height:0;
        mso-hide:all;
      }
      @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-width:15px 25px 15px 25px!important } }
      </style> 
       </head> 
       <body style="width:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
        <div class="es-wrapper-color" style="background-color:#F4F4F4"> 
         <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#f4f4f4"></v:fill>
            </v:background>
          <![endif]--> 
         <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
           <tr class="gmail-fix" height="0" style="border-collapse:collapse"> 
            <td style="padding:0;Margin:0"> 
             <table cellspacing="0" cellpadding="0" border="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:600px"> 
               <tr style="border-collapse:collapse"> 
                <td cellpadding="0" cellspacing="0" border="0" style="padding:0;Margin:0;line-height:1px;min-width:600px" height="0"><img src="https://esputnik.com/repository/applications/images/blank.gif" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;max-height:0px;min-height:0px;min-width:600px;width:600px" alt width="600" height="1"></td> 
               </tr> 
             </table></td> 
           </tr> 
           <tr style="border-collapse:collapse"> 
            <td valign="top" style="padding:0;Margin:0"> 
             <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#FFA73B;background-repeat:repeat;background-position:center top"> 
               <tr style="border-collapse:collapse"> 
                <td align="center" bgcolor="#3259A2" style="padding:0;Margin:0"> 
                 <table class="es-header-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="Margin:0;padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td valign="top" align="center" style="padding:0;Margin:0;width:580px"> 
                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr style="border-collapse:collapse"> 
                            <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://okmswv.stripocdn.email/content/guids/CABINET_315a0a75934a0f96bcb299629e92ca78/images/81661610472032511.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="150"></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table> 
             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
               <tr style="border-collapse:collapse"> 
                <td style="padding:0;Margin:0;background-color:#3259A2" bgcolor="#3259A2" align="center"> 
                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td valign="top" align="center" style="padding:0;Margin:0;width:600px"> 
                         <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#FFFFFF;border-radius:4px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation"> 
                           <tr style="border-collapse:collapse"> 
                            <td align="center" style="Margin:0;padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:35px"><h1 style="Margin:0;line-height:58px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:48px;font-style:normal;font-weight:normal;color:#111111">Welcome to Drops!</h1></td> 
                           </tr> 
                           <tr style="border-collapse:collapse"> 
                            <td bgcolor="#ffffff" align="center" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:20px;padding-right:20px;font-size:0"> 
                             <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr style="border-collapse:collapse"> 
                                <td style="padding:0;Margin:0;border-bottom:1px solid #FFFFFF;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table> 
             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
               <tr style="border-collapse:collapse"> 
                <td align="center" style="padding:0;Margin:0"> 
                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td valign="top" align="center" style="padding:0;Margin:0;width:600px"> 
                         <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:4px;background-color:#FFFFFF" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation"> 
                           <tr style="border-collapse:collapse"> 
                            <td class="es-m-txt-l" bgcolor="#ffffff" align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666">Hello ${fullName},&nbsp;&nbsp;let's get you set up your Drops-bot account. Here is your temporary credentials:</p></td> 
                           </tr> 
                           <tr style="border-collapse:collapse"> 
                            <td class="es-m-txt-l" bgcolor="#ffffff" align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666">Username: ${uname}<br>Temporary Password: ${tempPass}</p></td> 
                           </tr> 
                           <tr style="border-collapse:collapse"> 
                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666">When you log in to Drops-bot for the first time, you will be prompted to update your password. For questions or reporting a problem with login, contact your manager for further assistance. We are excited to have you with us!<br><br></p></td> 
                           </tr> 
                           <tr style="border-collapse:collapse"> 
                            <td align="center" style="padding:0;Margin:0;padding-bottom:25px"><span class="es-button-border" style="border-style:solid;border-color:#009DA0;background:#3259A2;border-width:1px;display:inline-block;border-radius:2px;width:auto"><a href="https://www.dropsbot.app/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:20px;color:#FFFFFF;border-style:solid;border-color:#3259A2;border-width:15px 25px 15px 25px;display:inline-block;background:#3259A2;border-radius:2px;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center">Login</a></span></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table> 
             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
               <tr style="border-collapse:collapse"> 
                <td align="center" style="padding:0;Margin:0"> 
                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td valign="top" align="center" style="padding:0;Margin:0;width:600px"> 
                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr style="border-collapse:collapse"> 
                            <td align="left" bgcolor="#ffffff" style="padding:0;Margin:0;padding-left:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666">Drops-bot!<br><br></p></td> 
                           </tr> 
                           <tr style="border-collapse:collapse"> 
                            <td align="center" style="Margin:0;padding-top:10px;padding-bottom:20px;padding-left:20px;padding-right:20px;font-size:0"> 
                             <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr style="border-collapse:collapse"> 
                                <td style="padding:0;Margin:0;border-bottom:1px solid #F4F4F4;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table> 
             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
               <tr style="border-collapse:collapse"> 
                <td align="center" style="padding:0;Margin:0"> 
                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="padding:0;Margin:0"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td valign="top" align="center" style="padding:0;Margin:0;width:600px"> 
                         <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#FFECD1;border-radius:4px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffecd1" role="presentation"> 
                           <tr style="border-collapse:collapse"> 
                            <td align="left" style="padding:15px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:20px;color:#999999">CONFIDENTIALITY NOTICE:This e-mail communication and any attachments may contain confidential and privileged information for the use of the designated recipients named above. If you are not the intended recipient, you are hereby notified that you have received this communication in error and that any review, disclosure, dissemination, distribution, or copying of it or its contents is strictly prohibited. If you have received this communication in error, please notify the sender by return e-mail and delete and/or destroy all copies of this communication and any attachments.</p></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table> 
             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
               <tr style="border-collapse:collapse"> 
                <td align="center" style="padding:0;Margin:0"> 
                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" align="center"> 
                   <tr style="border-collapse:collapse"> 
                    <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"> 
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                       <tr style="border-collapse:collapse"> 
                        <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                         <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr style="border-collapse:collapse"> 
                            <td align="center" style="padding:0;Margin:0;display:none"></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table></td> 
           </tr> 
         </table> 
        </div>  
       </body>
      </html>
`;
      const emailOptions = {
        to: body.email,
        from: config.get('email_sender'),
        subject: `Welcome to Drops!`,
        html: emailTemplate,
      };

      if (req.file == undefined) {
        if(body.gender==="male"){
          avatar = 'https://res.cloudinary.com/hw93eukdo/image/upload/v1610526077/male_iypciz.png';
        } else if(body.gender==="female"){
          avatar = 'https://res.cloudinary.com/hw93eukdo/image/upload/v1610526077/female_rmmbsp.png';
        } else{
          avatar = 'https://res.cloudinary.com/hw93eukdo/image/upload/v1610526077/other_mxpm4r.png';
        }
        userBody = { ...body, avatar, sections, password };
        let user = new User(userBody);
        await user.save();

        //send mail to user
        // send the email via sendgrid
        sendgrid.send(emailOptions,(err,result)=> {
          if(err){
            console.log(err);
            res.status(200).json({ user, msg: 'User Added Successfully', mailSent:false });
          }
          else{
            res.status(200).json({ user, msg: 'User Added Successfully', mailSent:true });
          }
        })
      } else {
        const avatar = req.file.path;

        cloudinary.uploader.upload(avatar, async function (result) {
          userBody = {
            ...body,
            password,
            avatar: result.secure_url,
            sections,
          };
          let user = new User(userBody);
          await user.save();

          //send mail to user
          // send the email via sendgrid
          sendgrid.send(emailOptions,(err,result)=> {
            if(err){
              console.log(err);
              res.status(200).json({ user, msg: 'User Added Successfully', mailSent:false });
            } 
            else{
              res.status(200).json({ user, msg: 'User Added Successfully', mailSent:true });
            }
          })
        });
      }
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
);

// if (req.file == undefined) {
//   userBody = {
//     username: body.username,
//     fullname: body.fullname,
//     email: body.email,
//     password: password,
//     gender: body.gender,
//     contactnumber: body.contactnumber,
//     type: body.type,
//     avatar: avatar,
//     sections: body.sections,
//   }
// } else {
//   userBody = {
//     username: body.username,
//     fullname: body.fullname,
//     email: body.email,
//     password: password,
//     gender: body.gender,
//     contactnumber: body.contactnumber,
//     type: body.type,
//     sections: body.sections,
//     avatar: `/uploads/user/${req.file.originalname}`,
//   }
// }

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error!');
  }
});

// // @route   GET api/users/:status
// // @desc    Get all users
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const users = await User.find()
//     res.json(users)
//   } catch (err) {
//     console.log(err)
//     res.status(500).send('Server Error!')
//   }
// })

// @route   GET api/users/search/sarchval
// @desc    Search user
// @access  Private
router.get('/search/:val', auth, async (req, res) => {
  try {
    const search = req.params.val;
    // const users = await User.find({username: /search/, contactnumber: /search/, email: /search/, gender: /search/, accountStatus: /search/});
    // const users = await User.find({username: {$regex: search}, contactnumber: {$regex: search}, email: {$regex: search}, accountStatus: {$regex: search} });
    const users = await User.find({
      $or: [
        { username: search },
        { contactnumber: search },
        { email: search },
        { gender: search },
        { accountStatus: search },
      ],
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error!');
  }
});

// @route   GET /api/users/id
// @desc    Get User by Id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'No user found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    // Check if id is not valid
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No User found' });
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] });
  }
});

// @route   GET api/users/verifySalaryCode/:code
// @desc    Verify Salary Code
// @access  Private
router.get('/verifySalaryCode/:code', auth, async (req, res) => {
  try {
    if (req.params.code === process.env.salarySecretCode) {
      return res.status(200).json({ msg: 'Successfully Authorize' });
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Wrong Authorization code.' }] });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: 'Server Error' });
  }
});

// @route  PUT api/users/:id
// @desc   Update a user
// @access Private
router.post(
  '/:id',
  upload.single('avatar'),
  [
    check('username', 'User Name is Required').not().isEmpty(),
    check('fullname', 'Full Name is Required').not().isEmpty(),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('contactnumber', 'Please Enter Contact Number').not().isEmpty(),
    check('gender', 'Please select your Gender').not().isEmpty(),
    check('birthday', 'Please select your Birth Date').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body));

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      // check if there is any record with same email and username of not this user
      const userByEmail = await User.findOne({
        _id: { $ne: req.params.id },
        email: body.email,
      });
      const userByUsername = await User.findOne({
        _id: { $ne: req.params.id },
        username: body.username,
      });
      if (userByEmail) {
        return res
          .status(422)
          .json({ errors: [{ msg: 'User with this Email already exists' }] });
      }
      if (userByUsername) {
        return res.status(500).json({
          errors: [{ msg: 'User with this Username already exists' }],
        });
      }

      if (body.birthday === 'undefined') {
        return res
          .status(500)
          .json({ errors: [{ msg: 'Please select birthday' }] });
      }
      var sections;
      if (req.body.sections) {
        sections = req.body.sections.split(',');
      }

      const avatar = gravatar.url(body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //check if the accountStatus is set to 'inactivated'..
      let inactivated_date;
      if (req.body.accountStatus && req.body.accountStatus === 'inactive') {
        inactivated_date = Date.now();
      }
      // It will update any number of requested fields both by Employee and Admin...
      let fieldsToUpdate;
      if (req.file === undefined) {
        fieldsToUpdate = { ...req.body };
        await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body,
              inactivated_date,
              sections,
            },
          },
          { new: true }
        );
      } else {
        const avatar = req.file.path;
        cloudinary.uploader.upload(avatar, async function (result) {
          await User.updateOne(
            { _id: req.params.id },
            {
              $set: {
                ...body,
                avatar: result.secure_url,
                inactivated_date,
                sections,
              },
            },
            { new: true }
          );
        });
      }

      res.status(200).json({ msg: 'User Updated Successfully' });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] });
    }
  }
);

// @route  POST api/users/changestatus/:id
// @desc   Change Account status (blocked/active)
// @access Private
router.post(auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          accountStatus: 'block',
        },
      }
    );
    res.status(200).json({ msg: 'Status Updated Successfully' });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] });
  }
});

// @route   POST /api/users/updatePassword/:id
// @desc    Update Password
// @access  Public

router.post(
  '/updatepassword/:id',
  [check('currentpassword', 'Current Password Field Required').not().isEmpty()],

  async (req, res) => {
    try {
      // const errors = validationResult(req)
      // if (!errors.isEmpty()) {
      //   return res.status(422).json({ errors: errors.array() })
      // }
      const user = await User.findById(req.params.id);

      const salt = await bcrypt.genSalt(10);

      const isMatch = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Password!!' }] });
      }

      if (req.body.newpassword !== req.body.confirmpassword) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Confirm Password didn't match!!" }] });
      }
      const newpass = await bcrypt.hash(req.body.newpassword, salt);

      await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            password: newpass,
            isPasswordChanged: true,
            accountStatus: 'active',
          },
        }
      );
      res.json({ type: 'success', msg: 'Password Updated Successfully!!' });
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] });
    }
  }
);

// @route  DELETE api/users/:id
// @desc   Delete a user
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Delete user Document
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'No User found' });
    }
    await user.remove();

    res.status(200).json({ msg: `Account Removed successfully` });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No User found' });
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] });
  }
});

// @route   GET api/users/forgetpassword/email
// @desc    Validate Email and Get Token
// @access  Private

router.get(
  '/forgetpassword/:email',
  [check('email', 'Please Enter a Valid Email').isEmail()],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email } = req.params;
    try {
      // check for existing user
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 300000 },
        (err, token) => {
          if (err) throw err;

          if (token) {
            return res.status(200).json({ token: token });
          }
        }
      );
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/users/resetpassword/reset_token
// @desc    Reset Password
// @access  Public

router.post('/resetpassword', async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const user_id = jwt.verify(req.body.resetToken, process.env.jwtSecret);
    //  check for existing user
    let user = await User.findById(user_id.user.id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const password = req.body.newpassword;

    const salt = await bcrypt.genSalt(10);

    newpassword = await bcrypt.hash(req.body.newpassword, salt);

    const userID = user._id;

    await User.updateOne(
      { _id: userID },
      {
        $set: {
          password: newpassword,
        },
      }
    );
    res.status(200).json({ msg: 'Password Updated Successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/confirmpassword
// @desc    confirms Password
// @access  Public
router.post('/confirmpassword/:id', async (req, res) => {
    const body = req.body;
    try {
      const user = await User.findById(body.id);
      const isMatch = await bcrypt.compare(
        body.confirmpassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Password!!' }] });
      }
      res.json({ type: 'success', msg: 'Password matched Successfully'});
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] });
    }
  }
);

module.exports = router;
