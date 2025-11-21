// Stub implementation for formidable
export default function formidable(options) {
  return {
    parse: (req) => {
      return Promise.resolve([
        {}, // fields
        {
          file: {
            filepath: '/tmp/stub-file',
            originalFilename: 'stub-file.pdf',
            mimetype: 'application/pdf',
            size: 1024,
          }
        } // files
      ]);
    }
  };
}

// For CommonJS compatibility
module.exports = formidable;
module.exports.default = formidable;
