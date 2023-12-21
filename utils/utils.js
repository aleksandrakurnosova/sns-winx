/*
 const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${location}[${param}]: ${msg}`;
};
*/
export const errorFormatter = ({ path, msg }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    //console.log('path: ', path);
    // console.log('msg: ', msg);
    return [[path], msg];
    //return [[path], { msg: msg }];
    //return `[${path}]: ${msg}`;
  };