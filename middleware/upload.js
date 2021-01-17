const multer = require('multer');

    module.exports = function (req, res, next) {
      var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, FILE_PATH)
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.originalname)
        }
      })
    
      var upload = multer({ storage: storage })
    
  };
  